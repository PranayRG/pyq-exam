'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Clock, BookOpen, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { getCurrentUser, getActiveAttempt, saveAttempt } from '@/lib/storage'
import { getExamById } from '@/data/exams'
import { User, Exam, ExamAttempt, QuestionStatus, ExamScore, SectionScore } from '@/lib/types'

function calculateScore(exam: Exam, attempt: ExamAttempt): ExamScore {
  let totalQuestions = 0
  let attempted = 0
  let correct = 0
  let incorrect = 0
  let unanswered = 0
  let markedForReview = 0
  const sectionScores: SectionScore[] = []

  exam.sections.forEach(section => {
    let secAttempted = 0
    let secCorrect = 0
    let secIncorrect = 0

    section.questions.forEach(q => {
      totalQuestions++
      const key = `${section.id}-${q.id}`
      const state = attempt.questionStates[key]
      
      if (!state || state.selectedOption === null) {
        unanswered++
      } else {
        attempted++
        secAttempted++
        if (state.selectedOption === q.correctAnswer) {
          correct++
          secCorrect++
        } else {
          incorrect++
          secIncorrect++
        }
      }

      if (state && (state.status === QuestionStatus.MARKED_REVIEW || state.status === QuestionStatus.ANSWERED_MARKED)) {
        markedForReview++
      }
    })

    sectionScores.push({
      sectionId: section.id,
      sectionName: section.name,
      totalQuestions: section.questions.length,
      attempted: secAttempted,
      correct: secCorrect,
      incorrect: secIncorrect,
      obtainedMarks: secCorrect * exam.marksPerQuestion,
      totalMarks: section.questions.length * exam.marksPerQuestion,
    })
  })

  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unanswered,
    markedForReview,
    totalMarks: totalQuestions * exam.marksPerQuestion,
    obtainedMarks: correct * exam.marksPerQuestion,
    percentage: totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0,
    sectionScores,
  }
}

export default function ExamPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.examId as string
  
  const [user, setUser] = useState<User | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null)
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const attemptRef = useRef<ExamAttempt | null>(null)

  // Keep attemptRef in sync
  useEffect(() => {
    attemptRef.current = attempt
  }, [attempt])

  // Initialize
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) { router.push('/'); return }
    setUser(currentUser)

    const examData = getExamById(examId)
    if (!examData) { router.push('/dashboard'); return }
    setExam(examData)

    const activeAttempt = getActiveAttempt(currentUser.id, examId)
    if (!activeAttempt) { router.push('/dashboard'); return }
    
    setAttempt(activeAttempt)
    setCurrentSectionIdx(activeAttempt.currentSectionIndex)
    setCurrentQuestionIdx(activeAttempt.currentQuestionIndex)
    setTimeRemaining(activeAttempt.timeRemainingSeconds)
    
    // Restore selected option for current question
    const section = examData.sections[activeAttempt.currentSectionIndex]
    if (section) {
      const question = section.questions[activeAttempt.currentQuestionIndex]
      if (question) {
        const key = `${section.id}-${question.id}`
        const state = activeAttempt.questionStates[key]
        setSelectedOption(state?.selectedOption ?? null)
      }
    }

    setLoading(false)
  }, [examId, router])

  // Timer
  useEffect(() => {
    if (loading || !attempt || attempt.completed) return

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const next = prev - 1
        if (next <= 0) {
          // Auto-submit
          handleSubmit(true)
          return 0
        }
        // Save time every 10 seconds
        if (next % 10 === 0 && attemptRef.current) {
          const updated = { ...attemptRef.current, timeRemainingSeconds: next }
          saveAttempt(updated)
        }
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, attempt?.completed])

  const getCurrentKey = useCallback(() => {
    if (!exam) return ''
    const section = exam.sections[currentSectionIdx]
    if (!section) return ''
    const question = section.questions[currentQuestionIdx]
    if (!question) return ''
    return `${section.id}-${question.id}`
  }, [exam, currentSectionIdx, currentQuestionIdx])

  const updateAttempt = useCallback((updates: Partial<ExamAttempt>) => {
    setAttempt(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      saveAttempt(updated)
      return updated
    })
  }, [])

  const navigateToQuestion = useCallback((sectionIdx: number, questionIdx: number) => {
    if (!exam || !attempt) return
    const section = exam.sections[sectionIdx]
    if (!section) return
    const question = section.questions[questionIdx]
    if (!question) return

    const key = `${section.id}-${question.id}`
    const questionStates = { ...attempt.questionStates }
    
    // Mark as NOT_ANSWERED if NOT_VISITED
    if (questionStates[key]?.status === QuestionStatus.NOT_VISITED) {
      questionStates[key] = { ...questionStates[key], status: QuestionStatus.NOT_ANSWERED }
    }

    setCurrentSectionIdx(sectionIdx)
    setCurrentQuestionIdx(questionIdx)
    setSelectedOption(questionStates[key]?.selectedOption ?? null)
    
    updateAttempt({
      questionStates,
      currentSectionIndex: sectionIdx,
      currentQuestionIndex: questionIdx,
      timeRemainingSeconds: timeRemaining,
    })
  }, [exam, attempt, timeRemaining, updateAttempt])

  const handleSaveAndNext = () => {
    if (!exam || !attempt) return
    const key = getCurrentKey()
    const questionStates = { ...attempt.questionStates }

    if (selectedOption !== null) {
      // Check if it was marked for review
      const wasMarked = questionStates[key]?.status === QuestionStatus.MARKED_REVIEW || 
                         questionStates[key]?.status === QuestionStatus.ANSWERED_MARKED
      questionStates[key] = {
        selectedOption,
        status: wasMarked ? QuestionStatus.ANSWERED_MARKED : QuestionStatus.ANSWERED,
      }
    } else {
      // No option selected - mark as not answered (unless marked for review)
      const wasMarked = questionStates[key]?.status === QuestionStatus.MARKED_REVIEW || 
                         questionStates[key]?.status === QuestionStatus.ANSWERED_MARKED
      if (!wasMarked) {
        questionStates[key] = {
          ...questionStates[key],
          selectedOption: null,
          status: QuestionStatus.NOT_ANSWERED,
        }
      }
    }

    updateAttempt({ questionStates, timeRemainingSeconds: timeRemaining })

    // Move to next question
    const section = exam.sections[currentSectionIdx]
    if (currentQuestionIdx < section.questions.length - 1) {
      navigateToQuestion(currentSectionIdx, currentQuestionIdx + 1)
    } else if (currentSectionIdx < exam.sections.length - 1) {
      navigateToQuestion(currentSectionIdx + 1, 0)
    }
  }

  const handleClearResponse = () => {
    if (!attempt) return
    const key = getCurrentKey()
    const questionStates = { ...attempt.questionStates }
    const currentState = questionStates[key]
    
    setSelectedOption(null)
    questionStates[key] = {
      selectedOption: null,
      status: currentState?.status === QuestionStatus.ANSWERED_MARKED || currentState?.status === QuestionStatus.MARKED_REVIEW
        ? QuestionStatus.MARKED_REVIEW
        : QuestionStatus.NOT_ANSWERED,
    }
    updateAttempt({ questionStates, timeRemainingSeconds: timeRemaining })
  }

  const handleMarkForReview = () => {
    if (!exam || !attempt) return
    const key = getCurrentKey()
    const questionStates = { ...attempt.questionStates }

    if (selectedOption !== null) {
      // Answered + Marked for Review (Purple with Green Dot)
      questionStates[key] = {
        selectedOption,
        status: QuestionStatus.ANSWERED_MARKED,
      }
    } else {
      // No answer, just marked for review (Purple)
      questionStates[key] = {
        selectedOption: null,
        status: QuestionStatus.MARKED_REVIEW,
      }
    }

    updateAttempt({ questionStates, timeRemainingSeconds: timeRemaining })

    // Move to next
    const section = exam.sections[currentSectionIdx]
    if (currentQuestionIdx < section.questions.length - 1) {
      navigateToQuestion(currentSectionIdx, currentQuestionIdx + 1)
    } else if (currentSectionIdx < exam.sections.length - 1) {
      navigateToQuestion(currentSectionIdx + 1, 0)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      navigateToQuestion(currentSectionIdx, currentQuestionIdx - 1)
    } else if (currentSectionIdx > 0) {
      const prevSection = exam!.sections[currentSectionIdx - 1]
      navigateToQuestion(currentSectionIdx - 1, prevSection.questions.length - 1)
    }
  }

  const handleNext = () => {
    if (!exam) return
    const section = exam.sections[currentSectionIdx]
    if (currentQuestionIdx < section.questions.length - 1) {
      navigateToQuestion(currentSectionIdx, currentQuestionIdx + 1)
    } else if (currentSectionIdx < exam.sections.length - 1) {
      navigateToQuestion(currentSectionIdx + 1, 0)
    }
  }

  const handleSubmit = (autoSubmit = false) => {
    if (!exam || !attempt) return
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    const score = calculateScore(exam, attempt)
    const completedAttempt: ExamAttempt = {
      ...attempt,
      completed: true,
      completedAt: new Date().toISOString(),
      timeRemainingSeconds: autoSubmit ? 0 : timeRemaining,
      score,
    }
    saveAttempt(completedAttempt)
    router.push(`/result/${examId}/${attempt.id}`)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0'),
    }
  }

  // Get submission summary
  const getSubmissionSummary = () => {
    if (!exam || !attempt) return { answered: 0, notAnswered: 0, notVisited: 0, markedReview: 0, answeredMarked: 0, total: 0 }
    let answered = 0, notAnswered = 0, notVisited = 0, markedReview = 0, answeredMarked = 0, total = 0
    exam.sections.forEach(section => {
      section.questions.forEach(q => {
        total++
        const key = `${section.id}-${q.id}`
        const state = attempt.questionStates[key]
        if (!state || state.status === QuestionStatus.NOT_VISITED) notVisited++
        else if (state.status === QuestionStatus.NOT_ANSWERED) notAnswered++
        else if (state.status === QuestionStatus.ANSWERED) answered++
        else if (state.status === QuestionStatus.MARKED_REVIEW) markedReview++
        else if (state.status === QuestionStatus.ANSWERED_MARKED) answeredMarked++
      })
    })
    return { answered, notAnswered, notVisited, markedReview, answeredMarked, total }
  }

  if (loading || !exam || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-exam-blue"></div>
      </div>
    )
  }

  const currentSection = exam.sections[currentSectionIdx]
  const currentQuestion = currentSection?.questions[currentQuestionIdx]
  const time = formatTime(timeRemaining)
  const isTimeWarning = timeRemaining <= 300 // 5 minutes warning

  // Calculate global question number for display
  let globalQuestionNumber = currentQuestionIdx + 1
  for (let i = 0; i < currentSectionIdx; i++) {
    globalQuestionNumber += exam.sections[i].questions.length
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-exam-blue">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-exam-blue" />
              <h1 className="text-base font-bold text-gray-900">
                {exam.title} — {exam.subject}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Section Tabs */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
            <div className="flex gap-1 -mb-px">
              {exam.sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => navigateToQuestion(idx, 0)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    idx === currentSectionIdx
                      ? 'border-exam-blue text-exam-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {/* Question Display */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentSection.name} — Question {currentQuestionIdx + 1}
                </h2>
                <span className="text-sm text-gray-500">
                  {currentQuestionIdx + 1} of {currentSection.questions.length}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-base text-gray-800 mb-6 leading-relaxed">
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedOption === idx
                        ? 'border-exam-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => setSelectedOption(idx)}
                      className="w-5 h-5 text-exam-blue focus:ring-exam-blue"
                    />
                    <span className="font-semibold text-gray-500 min-w-[24px]">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className={`text-sm ${selectedOption === idx ? 'text-exam-blue font-medium' : 'text-gray-700'}`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={handleMarkForReview} className="btn-danger text-sm px-4 py-2">
                  Mark for Review & Next
                </button>
                <button onClick={handleClearResponse} className="btn-secondary text-sm px-4 py-2">
                  Clear Response
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentSectionIdx === 0 && currentQuestionIdx === 0}
                  className="btn-primary text-sm px-4 py-2 flex items-center gap-1 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button onClick={handleSaveAndNext} className="btn-success text-sm px-4 py-2">
                  Save & Next
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    currentSectionIdx === exam.sections.length - 1 &&
                    currentQuestionIdx === currentSection.questions.length - 1
                  }
                  className="btn-primary text-sm px-4 py-2 flex items-center gap-1 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-exam-blue"></span> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-gray-300"></span> Not Visited
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-exam-green"></span> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-exam-red"></span> Not Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-exam-purple"></span> Review
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative w-3 h-3 rounded bg-exam-purple">
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-exam-green rounded-full"></span>
                </span> Answered+Review
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Timer + Palette */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-auto hidden md:flex">
          {/* Timer */}
          <div className={`p-4 border-b border-gray-200 ${isTimeWarning ? 'bg-red-50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-5 h-5 ${isTimeWarning ? 'text-exam-red animate-pulse' : 'text-gray-600'}`} />
              <h3 className={`font-semibold text-sm ${isTimeWarning ? 'text-exam-red' : 'text-gray-700'}`}>
                Time Left
              </h3>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="text-center">
                <span className={`text-2xl font-bold font-mono ${isTimeWarning ? 'text-exam-red' : 'text-gray-900'}`}>
                  {time.hours}
                </span>
                <p className="text-xs text-gray-500">hours</p>
              </div>
              <span className="text-2xl font-bold text-gray-400 -mt-4">:</span>
              <div className="text-center">
                <span className={`text-2xl font-bold font-mono ${isTimeWarning ? 'text-exam-red' : 'text-gray-900'}`}>
                  {time.minutes}
                </span>
                <p className="text-xs text-gray-500">min</p>
              </div>
              <span className="text-2xl font-bold text-gray-400 -mt-4">:</span>
              <div className="text-center">
                <span className={`text-2xl font-bold font-mono ${isTimeWarning ? 'text-exam-red' : 'text-gray-900'}`}>
                  {time.seconds}
                </span>
                <p className="text-xs text-gray-500">sec</p>
              </div>
            </div>
          </div>

          {/* Question Palette by Section */}
          <div className="flex-1 overflow-auto">
            {exam.sections.map((section, sectionIdx) => (
              <div key={section.id} className="border-b border-gray-200">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {section.name.length > 30 ? section.name.substring(0, 30) + '...' : section.name}
                  </h4>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-6 gap-1.5">
                    {section.questions.map((q, qIdx) => {
                      const key = `${section.id}-${q.id}`
                      const state = attempt.questionStates[key]
                      const isCurrent = sectionIdx === currentSectionIdx && qIdx === currentQuestionIdx

                      let paletteClass = 'palette-not-visited'
                      if (state) {
                        switch (state.status) {
                          case QuestionStatus.NOT_ANSWERED:
                            paletteClass = 'palette-not-answered'
                            break
                          case QuestionStatus.ANSWERED:
                            paletteClass = 'palette-answered'
                            break
                          case QuestionStatus.MARKED_REVIEW:
                            paletteClass = 'palette-marked-review'
                            break
                          case QuestionStatus.ANSWERED_MARKED:
                            paletteClass = 'palette-answered-marked'
                            break
                        }
                      }

                      return (
                        <button
                          key={key}
                          onClick={() => navigateToQuestion(sectionIdx, qIdx)}
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${paletteClass} ${
                            isCurrent ? 'palette-current' : ''
                          } hover:opacity-90`}
                          title={`Question ${qIdx + 1} - ${state?.status || 'Not Visited'}`}
                        >
                          {qIdx + 1}
                          {state?.status === QuestionStatus.ANSWERED_MARKED && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-exam-green rounded-full border-2 border-white"></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-exam-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-exam-orange" />
              <h3 className="text-xl font-bold text-gray-900">Submit Exam?</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to submit? You won&apos;t be able to change your answers after submission.
            </p>

            {/* Summary Table */}
            {(() => {
              const summary = getSubmissionSummary()
              return (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions</span>
                    <span className="font-semibold">{summary.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-exam-green">✓ Answered</span>
                    <span className="font-semibold text-exam-green">{summary.answered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-exam-red">✗ Not Answered</span>
                    <span className="font-semibold text-exam-red">{summary.notAnswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">○ Not Visited</span>
                    <span className="font-semibold text-gray-500">{summary.notVisited}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-exam-purple">◆ Marked for Review</span>
                    <span className="font-semibold text-exam-purple">{summary.markedReview}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-exam-purple">◆ Answered + Review</span>
                    <span className="font-semibold text-exam-purple">{summary.answeredMarked}</span>
                  </div>
                </div>
              )
            })()}

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn-secondary flex-1"
              >
                Go Back
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="btn-danger flex-1"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
