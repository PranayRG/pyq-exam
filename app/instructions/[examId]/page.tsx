'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BookOpen, ArrowLeft, CheckCircle2, AlertTriangle, Clock, Info } from 'lucide-react'
import { getCurrentUser, getActiveAttempt, saveAttempt, generateId } from '@/lib/storage'
import { getExamById } from '@/data/exams'
import { User, Exam, ExamAttempt, QuestionStatus } from '@/lib/types'

export default function InstructionsPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.examId as string
  
  const [user, setUser] = useState<User | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)

    const examData = getExamById(examId)
    if (!examData) {
      router.push('/dashboard')
      return
    }
    setExam(examData)
    setLoading(false)
  }, [examId, router])

  const handleStartExam = () => {
    if (!user || !exam || !agreed) return

    // Check for active attempt
    const activeAttempt = getActiveAttempt(user.id, examId)
    if (activeAttempt) {
      // Resume existing attempt
      router.push(`/exam/${examId}`)
      return
    }

    // Create new attempt
    const questionStates: Record<string, { status: QuestionStatus; selectedOption: number | null }> = {}
    exam.sections.forEach(section => {
      section.questions.forEach(q => {
        questionStates[`${section.id}-${q.id}`] = {
          status: QuestionStatus.NOT_VISITED,
          selectedOption: null,
        }
      })
    })

    // Mark first question as visited (NOT_ANSWERED since they'll see it)
    const firstSection = exam.sections[0]
    if (firstSection && firstSection.questions.length > 0) {
      questionStates[`${firstSection.id}-${firstSection.questions[0].id}`] = {
        status: QuestionStatus.NOT_ANSWERED,
        selectedOption: null,
      }
    }

    const attempt: ExamAttempt = {
      id: generateId(),
      examId: exam.id,
      userId: user.id,
      startedAt: new Date().toISOString(),
      timeRemainingSeconds: exam.durationMinutes * 60,
      questionStates,
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      completed: false,
    }

    saveAttempt(attempt)
    router.push(`/exam/${examId}`)
  }

  if (loading || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-exam-blue"></div>
      </div>
    )
  }

  const totalQuestions = exam.sections.reduce((sum, s) => sum + s.questions.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-exam-blue rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{exam.title}</h1>
                <p className="text-xs text-gray-500">{exam.subject}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-exam-blue" />
            <h2 className="text-2xl font-bold text-gray-900">General Instructions</h2>
          </div>

          {/* Exam Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Exam Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-blue-600">Total Questions:</span>
                <span className="font-semibold text-blue-900 ml-1">{totalQuestions}</span>
              </div>
              <div>
                <span className="text-blue-600">Total Marks:</span>
                <span className="font-semibold text-blue-900 ml-1">{exam.totalMarks}</span>
              </div>
              <div>
                <span className="text-blue-600">Duration:</span>
                <span className="font-semibold text-blue-900 ml-1">{exam.durationMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-blue-600">Marks per Question:</span>
                <span className="font-semibold text-blue-900 ml-1">+{exam.marksPerQuestion}</span>
              </div>
            </div>
          </div>

          {/* Sections Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Paper Structure</h3>
            {exam.sections.map((section, i) => (
              <div key={section.id} className="flex justify-between py-1.5 text-sm border-b last:border-0 border-gray-200">
                <span className="text-gray-700">{section.name}</span>
                <span className="font-semibold text-gray-900">
                  {section.questions.length} Questions • {section.questions.length * exam.marksPerQuestion} Marks
                </span>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-sm text-gray-700 mb-6">
            <h3 className="font-semibold text-gray-900 text-base">Important Instructions:</h3>
            
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>The examination consists of <strong>two mandatory papers</strong> conducted together in a single <strong>{exam.durationMinutes}-minute</strong> window with <strong>no break</strong> in between.</li>
              <li>Both papers contain <strong>Objective Type Multiple Choice Questions (MCQs)</strong> with <strong>4 options</strong> each, of which only <strong>ONE</strong> is correct.</li>
              <li>Each correct answer carries <strong>+{exam.marksPerQuestion} marks</strong>.</li>
              <li>There is <strong>NO negative marking</strong> for incorrect or unanswered questions. You will get <strong>0 marks</strong> for wrong answers.</li>
              <li>The clock will be set at the server and the countdown timer at the top right corner of the screen will display the remaining time.</li>
              <li>When the timer reaches zero, the exam will <strong>auto-submit</strong> automatically.</li>
            </ol>

            <h3 className="font-semibold text-gray-900 text-base mt-6">Navigating & Answering Questions:</h3>
            
            <ol className="list-decimal list-inside space-y-2 ml-2" start={7}>
              <li>Click on the question number in the <strong>Question Palette</strong> on the right to go directly to that question.</li>
              <li>Use <strong>"Save & Next"</strong> to save your answer and move to the next question.</li>
              <li>Use <strong>"Clear Response"</strong> to deselect your chosen option.</li>
              <li>Use <strong>"Mark for Review & Next"</strong> to tag a question for later review.</li>
              <li>Use <strong>"Previous"</strong> and <strong>"Next"</strong> buttons to navigate between questions.</li>
            </ol>

            {/* Palette Legend */}
            <h3 className="font-semibold text-gray-900 text-base mt-6">Question Palette Color Guide:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">1</div>
                <div>
                  <p className="font-medium text-gray-900">Not Visited</p>
                  <p className="text-xs text-gray-500">You have not visited the question yet</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-exam-red border-2 border-red-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">2</div>
                <div>
                  <p className="font-medium text-gray-900">Not Answered</p>
                  <p className="text-xs text-gray-500">Visited but no option selected</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-exam-green border-2 border-green-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">3</div>
                <div>
                  <p className="font-medium text-gray-900">Answered</p>
                  <p className="text-xs text-gray-500">Answer saved and will be evaluated</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-exam-purple border-2 border-purple-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">4</div>
                <div>
                  <p className="font-medium text-gray-900">Marked for Review</p>
                  <p className="text-xs text-gray-500">No answer selected, will NOT be evaluated</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <div className="w-10 h-10 bg-exam-purple border-2 border-purple-600 rounded-lg flex items-center justify-center text-sm font-bold text-white relative">
                  5
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-exam-green rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Answered & Marked for Review</p>
                  <p className="text-xs text-gray-500">Answer selected AND marked for review — <strong>WILL be evaluated</strong> (no negative marking)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Important Note:</p>
              <p>Since UGC NET has <strong>no negative marking</strong>, if you have answered a question and marked it for review (Purple with Green Dot), your answer <strong>WILL be evaluated for scoring</strong> even if you forget to come back to it. So it is always better to attempt all questions.</p>
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="border-t border-gray-200 pt-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-exam-blue focus:ring-exam-blue cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                I have read and understood all the instructions given above. I agree to abide by all the rules and regulations of this examination. I understand that this is a mock test for practice purposes only.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleStartExam}
              disabled={!agreed}
              className={`px-8 py-3 rounded-lg font-bold text-base flex items-center gap-2 transition-all duration-200 ${
                agreed
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg cursor-pointer transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border border-gray-400 opacity-60'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              Start Exam
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
