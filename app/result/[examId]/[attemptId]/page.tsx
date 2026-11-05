'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BookOpen, ArrowLeft, Trophy, Target, XCircle, MinusCircle, CheckCircle2, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { getCurrentUser, getAttempts } from '@/lib/storage'
import { getExamById } from '@/data/exams'
import { User, Exam, ExamAttempt, QuestionStatus } from '@/lib/types'

export default function ResultPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.examId as string
  const attemptId = params.attemptId as string

  const [user, setUser] = useState<User | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) { router.push('/'); return }
    setUser(currentUser)

    const examData = getExamById(examId)
    if (!examData) { router.push('/dashboard'); return }
    setExam(examData)

    const attempts = getAttempts()
    const found = attempts.find(a => a.id === attemptId && a.userId === currentUser.id)
    if (!found || !found.completed || !found.score) { router.push('/dashboard'); return }
    setAttempt(found)
    setLoading(false)
  }, [examId, attemptId, router])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  if (loading || !exam || !attempt || !attempt.score) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-exam-blue"></div>
      </div>
    )
  }

  const score = attempt.score
  const isPassed = score.percentage >= 40 // General passing criteria indication

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <BookOpen className="w-5 h-5 text-exam-blue" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Exam Result</h1>
                <p className="text-xs text-gray-500">{exam.title} — {exam.subject}</p>
              </div>
            </div>
            <button onClick={() => router.push('/dashboard')} className="btn-primary text-sm">
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className={`card mb-6 ${isPassed ? 'border-green-300' : 'border-orange-300'} border-2`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Score Circle */}
            <div className="flex-shrink-0">
              <div className={`w-36 h-36 rounded-full border-8 ${isPassed ? 'border-exam-green' : 'border-exam-orange'} flex flex-col items-center justify-center`}>
                <Trophy className={`w-6 h-6 ${isPassed ? 'text-exam-green' : 'text-exam-orange'} mb-1`} />
                <span className={`text-3xl font-bold ${isPassed ? 'text-exam-green' : 'text-exam-orange'}`}>
                  {score.obtainedMarks}
                </span>
                <span className="text-sm text-gray-500">out of {score.totalMarks}</span>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {score.percentage.toFixed(1)}%
              </h2>
              <p className="text-gray-500 mb-4">
                {user?.name} • {new Date(attempt.completedAt!).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-exam-green mx-auto mb-1" />
                  <p className="text-xl font-bold text-exam-green">{score.correct}</p>
                  <p className="text-xs text-green-600">Correct</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <XCircle className="w-5 h-5 text-exam-red mx-auto mb-1" />
                  <p className="text-xl font-bold text-exam-red">{score.incorrect}</p>
                  <p className="text-xs text-red-600">Incorrect</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <MinusCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-600">{score.unanswered}</p>
                  <p className="text-xs text-gray-500">Unanswered</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <Target className="w-5 h-5 text-exam-blue mx-auto mb-1" />
                  <p className="text-xl font-bold text-exam-blue">{score.attempted}</p>
                  <p className="text-xs text-blue-600">Attempted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section-wise Breakdown */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Section-wise Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-gray-600 font-medium">Section</th>
                  <th className="text-center py-3 px-2 text-gray-600 font-medium">Total</th>
                  <th className="text-center py-3 px-2 text-gray-600 font-medium">Attempted</th>
                  <th className="text-center py-3 px-2 text-exam-green font-medium">Correct</th>
                  <th className="text-center py-3 px-2 text-exam-red font-medium">Incorrect</th>
                  <th className="text-center py-3 px-2 text-gray-600 font-medium">Marks</th>
                </tr>
              </thead>
              <tbody>
                {score.sectionScores.map(sec => (
                  <tr key={sec.sectionId} className="border-b border-gray-100">
                    <td className="py-3 px-2 font-medium text-gray-900">{sec.sectionName}</td>
                    <td className="text-center py-3 px-2">{sec.totalQuestions}</td>
                    <td className="text-center py-3 px-2">{sec.attempted}</td>
                    <td className="text-center py-3 px-2 text-exam-green font-semibold">{sec.correct}</td>
                    <td className="text-center py-3 px-2 text-exam-red font-semibold">{sec.incorrect}</td>
                    <td className="text-center py-3 px-2 font-bold">{sec.obtainedMarks}/{sec.totalMarks}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td className="py-3 px-2">Total</td>
                  <td className="text-center py-3 px-2">{score.totalQuestions}</td>
                  <td className="text-center py-3 px-2">{score.attempted}</td>
                  <td className="text-center py-3 px-2 text-exam-green">{score.correct}</td>
                  <td className="text-center py-3 px-2 text-exam-red">{score.incorrect}</td>
                  <td className="text-center py-3 px-2">{score.obtainedMarks}/{score.totalMarks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Toggle */}
        <button
          onClick={() => setShowReview(!showReview)}
          className="btn-primary mb-6 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {showReview ? 'Hide' : 'Show'} Question-wise Review
        </button>

        {/* Question-by-Question Review */}
        {showReview && (
          <div className="space-y-4">
            {exam.sections.map(section => (
              <div key={section.id} className="card">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-lg font-bold text-gray-900">{section.name}</h3>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections[section.id] && (
                  <div className="mt-4 space-y-4">
                    {section.questions.map((q, qIdx) => {
                      const key = `${section.id}-${q.id}`
                      const state = attempt.questionStates[key]
                      const selected = state?.selectedOption ?? null
                      const isCorrect = Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.includes(selected!)
                        : selected === q.correctAnswer
                      const isAttempted = selected !== null

                      return (
                        <div
                          key={key}
                          className={`p-4 rounded-lg border-2 ${
                            !isAttempted
                              ? 'border-gray-200 bg-gray-50'
                              : isCorrect
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                              !isAttempted ? 'bg-gray-400' : isCorrect ? 'bg-exam-green' : 'bg-exam-red'
                            }`}>
                              {qIdx + 1}
                            </span>
                            <p className="text-sm text-gray-800 font-medium">{q.question}</p>
                          </div>

                          <div className="ml-11 space-y-1.5">
                            {q.options.map((option, optIdx) => {
                              const isSelectedOption = selected === optIdx
                              const isCorrectOption = Array.isArray(q.correctAnswer)
                                ? q.correctAnswer.includes(optIdx)
                                : q.correctAnswer === optIdx

                              let optionClass = 'text-gray-600'
                              let icon = ''
                              if (isCorrectOption) {
                                optionClass = 'text-exam-green font-semibold'
                                icon = '✓'
                              }
                              if (isSelectedOption && !isCorrect) {
                                optionClass = 'text-exam-red line-through'
                                icon = '✗'
                              }
                              if (isSelectedOption && isCorrect) {
                                optionClass = 'text-exam-green font-semibold'
                                icon = '✓'
                              }

                              return (
                                <div key={optIdx} className={`flex items-center gap-2 text-sm ${optionClass}`}>
                                  <span className="w-5 text-right">{icon}</span>
                                  <span className="font-medium text-gray-400">{String.fromCharCode(65 + optIdx)}.</span>
                                  <span>{option}</span>
                                </div>
                              )
                            })}
                          </div>

                          {q.explanation && (
                            <div className="ml-11 mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800 border border-blue-200">
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}

                          {/* Status badge */}
                          <div className="ml-11 mt-2 flex items-center gap-2">
                            {!isAttempted && (
                              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">Unanswered</span>
                            )}
                            {isAttempted && isCorrect && (
                              <span className="text-xs px-2 py-0.5 bg-green-200 text-green-700 rounded-full">+{exam.marksPerQuestion} marks</span>
                            )}
                            {isAttempted && !isCorrect && (
                              <span className="text-xs px-2 py-0.5 bg-red-200 text-red-700 rounded-full">0 marks</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
