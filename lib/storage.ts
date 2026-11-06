import { User, ExamAttempt, QuestionState, QuestionStatus, ExamScore } from './types'
import { supabase } from './supabase'

const STORAGE_KEYS = {
  USERS: 'ugc_net_users',
  CURRENT_USER: 'ugc_net_current_user',
  ATTEMPTS: 'ugc_net_attempts',
}

// Generate valid RFC4122 v4 UUID for Supabase uuid columns
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Helper to convert database row to ExamAttempt
function rowToAttempt(row: any): ExamAttempt {
  return {
    id: row.id,
    userId: row.user_id,
    examId: row.exam_id,
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
    timeRemainingSeconds: row.time_remaining_seconds,
    questionStates: row.question_states || {},
    currentSectionIndex: row.current_section_index || 0,
    currentQuestionIndex: row.current_question_index || 0,
    completed: row.completed,
    score: row.score || undefined,
  }
}

// Helper to convert database row to User
function rowToUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    name: row.name,
    createdAt: row.created_at,
  }
}

// ===== User Management =====

export function getLocalUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveLocalUser(user: User): void {
  const users = getLocalUsers()
  const idx = users.findIndex(u => u.id === user.id)
  if (idx >= 0) {
    users[idx] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export async function findUser(username: string, password: string): Promise<User | null> {
  const cleanUsername = username.trim()
  try {
    // 1. Try Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', cleanUsername)
      .eq('password', password)
      .maybeSingle()

    if (data && !error) {
      const user = rowToUser(data)
      saveLocalUser(user)
      return user
    }
  } catch (err) {
    console.warn('Supabase findUser error, checking local storage:', err)
  }

  // 2. Fallback to localStorage
  const localUsers = getLocalUsers()
  return localUsers.find(u => u.username === cleanUsername && u.password === password) || null
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const cleanUsername = username.trim()
  try {
    // 1. Try Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', cleanUsername)
      .maybeSingle()

    if (data && !error) {
      return rowToUser(data)
    }
  } catch (err) {
    console.warn('Supabase findUserByUsername error:', err)
  }

  // 2. Fallback to localStorage
  const localUsers = getLocalUsers()
  return localUsers.find(u => u.username === cleanUsername) || null
}

export async function saveUser(user: User): Promise<void> {
  // Always save to Supabase
  const { error } = await supabase.from('users').insert({
    id: user.id,
    username: user.username,
    password: user.password,
    name: user.name,
    created_at: user.createdAt,
  })

  if (error) {
    console.error('Supabase saveUser error:', error)
    throw new Error(error.message)
  }

  // Save locally
  saveLocalUser(user)
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

// ===== Exam Attempts =====

export function getAttempts(): ExamAttempt[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS)
  return data ? JSON.parse(data) : []
}

export function saveLocalAttempt(attempt: ExamAttempt): void {
  const attempts = getAttempts()
  const existingIndex = attempts.findIndex(a => a.id === attempt.id)
  if (existingIndex >= 0) {
    attempts[existingIndex] = attempt
  } else {
    attempts.push(attempt)
  }
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts))
}

export async function saveAttemptToSupabase(attempt: ExamAttempt): Promise<void> {
  try {
    const { error } = await supabase.from('exam_attempts').upsert({
      id: attempt.id,
      user_id: attempt.userId,
      exam_id: attempt.examId,
      started_at: attempt.startedAt,
      completed_at: attempt.completedAt || null,
      time_remaining_seconds: attempt.timeRemainingSeconds,
      question_states: attempt.questionStates,
      current_section_index: attempt.currentSectionIndex,
      current_question_index: attempt.currentQuestionIndex,
      completed: attempt.completed,
      score: attempt.score || null,
    })
    if (error) {
      console.warn('Supabase saveAttempt error:', error)
    }
  } catch (err) {
    console.warn('Could not save attempt to Supabase:', err)
  }
}

// Hybrid save: saves immediately to localStorage, then updates Supabase
export function saveAttempt(attempt: ExamAttempt): void {
  saveLocalAttempt(attempt)
  // Background sync to Supabase without blocking CBT UI
  saveAttemptToSupabase(attempt).catch(() => {})
}

// Asynchronous save that waits for Supabase confirmation (used on final submit)
export async function saveAttemptSync(attempt: ExamAttempt): Promise<void> {
  saveLocalAttempt(attempt)
  await saveAttemptToSupabase(attempt)
}

// Sync user's attempts from Supabase to local state
export async function syncAttemptsFromSupabase(userId: string): Promise<ExamAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('exam_attempts')
      .select('*')
      .eq('user_id', userId)

    if (data && !error && data.length > 0) {
      const dbAttempts = data.map(rowToAttempt)
      const localAttempts = getAttempts()

      // Merge: DB attempts + any unsynced local attempts
      const map = new Map<string, ExamAttempt>()
      localAttempts.forEach(a => map.set(a.id, a))
      dbAttempts.forEach(a => map.set(a.id, a))

      const merged = Array.from(map.values())
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(merged))
      return merged
    }
  } catch (err) {
    console.warn('Failed to sync attempts from Supabase:', err)
  }
  return getAttempts()
}

export function getAttemptsByUser(userId: string): ExamAttempt[] {
  return getAttempts().filter(a => a.userId === userId)
}

export function getAttemptsByExam(userId: string, examId: string): ExamAttempt[] {
  return getAttempts().filter(a => a.userId === userId && a.examId === examId)
}

export function getLatestAttempt(userId: string, examId: string): ExamAttempt | null {
  const attempts = getAttemptsByExam(userId, examId)
  if (attempts.length === 0) return null
  return attempts.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0]
}

export function getActiveAttempt(userId: string, examId: string): ExamAttempt | null {
  const attempts = getAttemptsByExam(userId, examId)
  return attempts.find(a => !a.completed) || null
}
