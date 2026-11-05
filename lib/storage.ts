import { User, ExamAttempt, QuestionState, QuestionStatus, ExamScore } from './types'

const STORAGE_KEYS = {
  USERS: 'ugc_net_users',
  CURRENT_USER: 'ugc_net_current_user',
  ATTEMPTS: 'ugc_net_attempts',
}

// ===== User Management =====

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveUser(user: User): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function findUser(username: string, password: string): User | null {
  const users = getUsers()
  return users.find(u => u.username === username && u.password === password) || null
}

export function findUserByUsername(username: string): User | null {
  const users = getUsers()
  return users.find(u => u.username === username) || null
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

export function saveAttempt(attempt: ExamAttempt): void {
  const attempts = getAttempts()
  const existingIndex = attempts.findIndex(a => a.id === attempt.id)
  if (existingIndex >= 0) {
    attempts[existingIndex] = attempt
  } else {
    attempts.push(attempt)
  }
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts))
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

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
