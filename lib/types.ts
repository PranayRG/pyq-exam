// ===== Exam Data Types =====

export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number | number[] // index (0-3) or array of acceptable indices if multi-key
  explanation?: string
  image?: string // optional image path or url for complex diagrams/tables
}

export interface Section {
  id: string
  name: string
  questions: Question[]
}

export interface Exam {
  id: string
  title: string
  exam: string          // e.g., "UGC NET"
  subject: string       // e.g., "Forensic Science"
  year: string          // e.g., "June 2024"
  durationMinutes: number
  totalMarks: number
  marksPerQuestion: number
  sections: Section[]
}

// ===== Question Status (Palette Colors) =====

export enum QuestionStatus {
  NOT_VISITED = 'NOT_VISITED',         // White
  NOT_ANSWERED = 'NOT_ANSWERED',       // Red - visited but no option selected
  ANSWERED = 'ANSWERED',               // Green - option selected and saved
  MARKED_REVIEW = 'MARKED_REVIEW',     // Purple - no option, marked for review
  ANSWERED_MARKED = 'ANSWERED_MARKED', // Purple with Green Dot - answered + marked for review
}

// ===== Exam Attempt (Saved State) =====

export interface QuestionState {
  status: QuestionStatus
  selectedOption: number | null // index of selected option (0-3) or null
}

export interface ExamAttempt {
  id: string
  examId: string
  userId: string
  startedAt: string          // ISO timestamp
  completedAt?: string       // ISO timestamp when submitted
  timeRemainingSeconds: number
  questionStates: Record<string, QuestionState> // key: "sectionId-questionId"
  currentSectionIndex: number
  currentQuestionIndex: number
  completed: boolean
  score?: ExamScore
}

export interface ExamScore {
  totalQuestions: number
  attempted: number
  correct: number
  incorrect: number
  unanswered: number
  markedForReview: number
  totalMarks: number
  obtainedMarks: number
  percentage: number
  sectionScores: SectionScore[]
}

export interface SectionScore {
  sectionId: string
  sectionName: string
  totalQuestions: number
  attempted: number
  correct: number
  incorrect: number
  obtainedMarks: number
  totalMarks: number
}

// ===== User =====

export interface User {
  id: string
  name: string
  username: string
  password: string  // Note: In localStorage mode, stored as plain text. Will be hashed with Supabase.
  createdAt: string
}

// ===== Dashboard Types =====

export interface ExamTile {
  exam: Exam
  attempt?: ExamAttempt  // most recent attempt if exists
  attemptCount: number
}
