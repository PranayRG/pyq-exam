'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Clock, BookOpen, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, RotateCcw } from 'lucide-react'
import { getCurrentUser, getActiveAttempt, saveAttempt } from '@/lib/storage'
import { getExamById } from '@/data/exams'
import { User, Exam, ExamAttempt, QuestionStatus, ExamScore, SectionScore, QuestionState } from '@/lib/types'

function calculateScore(exam: Exam, questionStates: Record<string, QuestionState>): ExamScore {
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
      const state = questionStates[key]
      
      // UGC NET Rule: Both ANSWERED and ANSWERED_MARKED are evaluated for marks!
      if (!state || state.selectedOption === null || state.selectedOption === undefined) {
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
  
  // Independent state for smooth UI and instant responsiveness
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({})
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Refs to always have the latest values inside callbacks and timer intervals
  const attemptRef = useRef<ExamAttempt | null>(null)
  const questionStatesRef = useRef<Record<string, QuestionState>>({})
  const currentSectionIdxRef = useRef(0)
  const currentQuestionIdxRef = useRef(0)
  const selectedOptionRef = useRef<number | null>(null)
  const timeRemainingRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Synchronize refs
  questionStatesRef.current = questionStates
  currentSectionIdxRef.current = currentSectionIdx
  currentQuestionIdxRef.current = currentQuestionIdx
  selectedOptionRef.current = selectedOption
  timeRemainingRef.current = timeRemaining

  // Initialize Exam Session
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

    const activeAttempt = getActiveAttempt(currentUser.id, examId)
    if (!activeAttempt) {
      router.push('/dashboard')
      return
    }

    setAttempt(activeAttempt)
    attemptRef.current = activeAttempt

    const initialStates = { ...activeAttempt.questionStates }
    const sIdx = activeAttempt.currentSectionIndex ?? 0
    const qIdx = activeAttempt.currentQuestionIndex ?? 0
    const curSec = examData.sections[sIdx] || examData.sections[0]
    const curQ = curSec?.questions[qIdx] || curSec?.questions[0]
    
    if (curSec && curQ) {
      const curKey = `${curSec.id}-${curQ.id}`
      const existing = initialStates[curKey]
      // If first visited, make sure it is marked NOT_ANSWERED (visited)
      if (!existing || existing.status === QuestionStatus.NOT_VISITED) {
        initialStates[curKey] = {
          status: QuestionStatus.NOT_ANSWERED,
          selectedOption: null,
        }
      }
      setSelectedOption(initialStates[curKey]?.selectedOption ?? null)
    }

    setQuestionStates(initialStates)
    questionStatesRef.current = initialStates
    setCurrentSectionIdx(sIdx)
    setCurrentQuestionIdx(qIdx)
    setTimeRemaining(activeAttempt.timeRemainingSeconds)

    setLoading(false)
  }, [examId, router])

  // Countdown Timer with Auto-submit
  useEffect(() => {
    if (loading || !attempt) return

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const next = prev - 1
        timeRemainingRef.current = next

        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleSubmitTest(true)
          return 0
        }

        // Auto-save remaining time every 15 seconds
        if (next % 15 === 0 && attemptRef.current) {
          const updated: ExamAttempt = {
            ...attemptRef.current,
            timeRemainingSeconds: next,
            questionStates: questionStatesRef.current,
            currentSectionIndex: currentSectionIdxRef.current,
            currentQuestionIndex: currentQuestionIdxRef.current,
          }
          attemptRef.current = updated
          saveAttempt(updated)
        }
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [loading, attempt])

  // Core navigation function that commits the current question's answer and moves to target question
  const commitAndNavigate = (
    targetSecIdx: number,
    targetQIdx: number,
    action: 'save_next' | 'mark_review' | 'navigate'
  ) => {
    if (!exam || !attemptRef.current) return

    const curSec = exam.sections[currentSectionIdxRef.current]
    if (!curSec) return
    const curQ = curSec.questions[currentQuestionIdxRef.current]
    if (!curQ) return

    const currentKey = `${curSec.id}-${curQ.id}`
    const updatedStates = { ...questionStatesRef.current }
    const currentOption = selectedOptionRef.current
    const prevStatus = updatedStates[currentKey]?.status

    // 1. Determine new status of CURRENT question
    if (action === 'save_next') {
      if (currentOption !== null) {
        // "Save & Next" confirms the answer and clears any review tag -> Turns Green (ANSWERED)
        updatedStates[currentKey] = {
          selectedOption: currentOption,
          status: QuestionStatus.ANSWERED,
        }
      } else {
        // No option selected -> Turns Red (NOT_ANSWERED)
        updatedStates[currentKey] = {
          selectedOption: null,
          status: QuestionStatus.NOT_ANSWERED,
        }
      }
    } else if (action === 'mark_review') {
      if (currentOption !== null) {
        updatedStates[currentKey] = {
          selectedOption: currentOption,
          status: QuestionStatus.ANSWERED_MARKED,
        }
      } else {
        updatedStates[currentKey] = {
          selectedOption: null,
          status: QuestionStatus.MARKED_REVIEW,
        }
      }
    } else if (action === 'navigate') {
      // Direct navigation (Next, Previous, or clicking palette number)
      // As per rule 3: If user selected an answer, automatically save it as Answered (Green)!
      if (currentOption !== null) {
        updatedStates[currentKey] = {
          selectedOption: currentOption,
          status: prevStatus === QuestionStatus.MARKED_REVIEW || prevStatus === QuestionStatus.ANSWERED_MARKED
            ? QuestionStatus.ANSWERED_MARKED
            : QuestionStatus.ANSWERED,
        }
      } else {
        // If not answered yet, ensure it is marked as NOT_ANSWERED (Red) since they visited it
        if (!prevStatus || prevStatus === QuestionStatus.NOT_VISITED) {
          updatedStates[currentKey] = {
            selectedOption: null,
            status: QuestionStatus.NOT_ANSWERED,
          }
        }
      }
    }

    // 2. Prepare TARGET question
    const targetSec = exam.sections[targetSecIdx]
    if (!targetSec) return
    const targetQ = targetSec.questions[targetQIdx]
    if (!targetQ) return

    const targetKey = `${targetSec.id}-${targetQ.id}`
    const targetExisting = updatedStates[targetKey]

    // If target question is NOT_VISITED, it now becomes NOT_ANSWERED (Red)
    if (!targetExisting || targetExisting.status === QuestionStatus.NOT_VISITED) {
      updatedStates[targetKey] = {
        selectedOption: null,
        status: QuestionStatus.NOT_ANSWERED,
      }
    }

    // Get target question's saved option (or null if none)
    const targetSelectedOption = updatedStates[targetKey]?.selectedOption ?? null

    // 3. Update all states synchronously and save to localStorage
    const updatedAttempt: ExamAttempt = {
      ...attemptRef.current,
      questionStates: updatedStates,
      currentSectionIndex: targetSecIdx,
      currentQuestionIndex: targetQIdx,
      timeRemainingSeconds: timeRemainingRef.current,
    }

    attemptRef.current = updatedAttempt
    questionStatesRef.current = updatedStates
    currentSectionIdxRef.current = targetSecIdx
    currentQuestionIdxRef.current = targetQIdx
    selectedOptionRef.current = targetSelectedOption

    // Persist immediately to localStorage
    saveAttempt(updatedAttempt)

    // Update React state
    setQuestionStates(updatedStates)
    setCurrentSectionIdx(targetSecIdx)
    setCurrentQuestionIdx(targetQIdx)
    setSelectedOption(targetSelectedOption)
    setAttempt(updatedAttempt)
  }

  // Option Click: When user selects an option on current question
  const handleOptionSelect = (optionIdx: number) => {
    setSelectedOption(optionIdx)
    selectedOptionRef.current = optionIdx

    // Proactively save into questionStates for immediate palette reflection if desired
    const curSec = exam?.sections[currentSectionIdx]
    const curQ = curSec?.questions[currentQuestionIdx]
    if (!curSec || !curQ) return

    const key = `${curSec.id}-${curQ.id}`
    const updatedStates = { ...questionStatesRef.current }
    const prevStatus = updatedStates[key]?.status

    updatedStates[key] = {
      selectedOption: optionIdx,
      status: prevStatus === QuestionStatus.MARKED_REVIEW || prevStatus === QuestionStatus.ANSWERED_MARKED
        ? QuestionStatus.ANSWERED_MARKED
        : QuestionStatus.ANSWERED,
    }

    questionStatesRef.current = updatedStates
    setQuestionStates(updatedStates)

    if (attemptRef.current) {
      const updated: ExamAttempt = {
        ...attemptRef.current,
        questionStates: updatedStates,
        timeRemainingSeconds: timeRemainingRef.current,
      }
      attemptRef.current = updated
      saveAttempt(updated)
    }
  }

  // Button: Save & Next
  const handleSaveAndNext = () => {
    if (!exam) return
    const curSec = exam.sections[currentSectionIdx]
    if (currentQuestionIdx < curSec.questions.length - 1) {
      commitAndNavigate(currentSectionIdx, currentQuestionIdx + 1, 'save_next')
    } else if (currentSectionIdx < exam.sections.length - 1) {
      commitAndNavigate(currentSectionIdx + 1, 0, 'save_next')
    } else {
      // Last question of last section - save response and stay or show submit
      commitAndNavigate(currentSectionIdx, currentQuestionIdx, 'save_next')
    }
  }

  // Button: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    if (!exam) return
    const curSec = exam.sections[currentSectionIdx]
    if (currentQuestionIdx < curSec.questions.length - 1) {
      commitAndNavigate(currentSectionIdx, currentQuestionIdx + 1, 'mark_review')
    } else if (currentSectionIdx < exam.sections.length - 1) {
      commitAndNavigate(currentSectionIdx + 1, 0, 'mark_review')
    } else {
      commitAndNavigate(currentSectionIdx, currentQuestionIdx, 'mark_review')
    }
  }

  // Button: Clear Response (ONLY for this particular question)
  const handleClearResponse = () => {
    if (!exam || !attemptRef.current) return

    const curSec = exam.sections[currentSectionIdx]
    if (!curSec) return
    const curQ = curSec.questions[currentQuestionIdx]
    if (!curQ) return

    const key = `${curSec.id}-${curQ.id}`
    const updatedStates = { ...questionStatesRef.current }
    const prevStatus = updatedStates[key]?.status

    setSelectedOption(null)
    selectedOptionRef.current = null

    // Clear ONLY current question and reset its status to NOT_ANSWERED (Red)
    updatedStates[key] = {
      selectedOption: null,
      status: QuestionStatus.NOT_ANSWERED,
    }

    questionStatesRef.current = updatedStates
    setQuestionStates(updatedStates)

    const updatedAttempt: ExamAttempt = {
      ...attemptRef.current,
      questionStates: updatedStates,
      timeRemainingSeconds: timeRemainingRef.current,
    }
    attemptRef.current = updatedAttempt
    saveAttempt(updatedAttempt)
  }

  // Button: Previous Question
  const handlePrevious = () => {
    if (currentQuestionIdx > 0) {
      commitAndNavigate(currentSectionIdx, currentQuestionIdx - 1, 'navigate')
    } else if (currentSectionIdx > 0 && exam) {
      const prevSecIdx = currentSectionIdx - 1
      const prevSec = exam.sections[prevSecIdx]
      commitAndNavigate(prevSecIdx, prevSec.questions.length - 1, 'navigate')
    }
  }

  // Button: Next Question
  const handleNext = () => {
    if (!exam) return
    const curSec = exam.sections[currentSectionIdx]
    if (currentQuestionIdx < curSec.questions.length - 1) {
      commitAndNavigate(currentSectionIdx, currentQuestionIdx + 1, 'navigate')
    } else if (currentSectionIdx < exam.sections.length - 1) {
      commitAndNavigate(currentSectionIdx + 1, 0, 'navigate')
    }
  }

  // Jump to specific question from palette or section tabs
  const handlePaletteJump = (targetSecIdx: number, targetQIdx: number) => {
    commitAndNavigate(targetSecIdx, targetQIdx, 'navigate')
  }

  // Submit Test
  const handleSubmitTest = (autoSubmit = false) => {
    if (!exam || !attemptRef.current) return
    if (timerRef.current) clearInterval(timerRef.current)

    // Make sure current question state is committed before score calculation
    const curSec = exam.sections[currentSectionIdxRef.current]
    const curQ = curSec?.questions[currentQuestionIdxRef.current]
    const finalStates = { ...questionStatesRef.current }

    if (curSec && curQ) {
      const key = `${curSec.id}-${curQ.id}`
      const curOpt = selectedOptionRef.current
      if (curOpt !== null) {
        const prev = finalStates[key]?.status
        finalStates[key] = {
          selectedOption: curOpt,
          status: prev === QuestionStatus.MARKED_REVIEW || prev === QuestionStatus.ANSWERED_MARKED
            ? QuestionStatus.ANSWERED_MARKED
            : QuestionStatus.ANSWERED,
        }
      }
    }

    const score = calculateScore(exam, finalStates)
    const completedAttempt: ExamAttempt = {
      ...attemptRef.current,
      completed: true,
      completedAt: new Date().toISOString(),
      timeRemainingSeconds: autoSubmit ? 0 : timeRemainingRef.current,
      questionStates: finalStates,
      score,
    }

    saveAttempt(completedAttempt)
    router.push(`/result/${examId}/${completedAttempt.id}`)
  }

  // Format Time (HH : MM : SS)
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

  // Summary counts for current exam
  const summaryCounts = useMemo(() => {
    let answered = 0
    let notAnswered = 0
    let notVisited = 0
    let markedReview = 0
    let answeredMarked = 0
    let total = 0

    if (!exam) return { answered, notAnswered, notVisited, markedReview, answeredMarked, total }

    exam.sections.forEach(section => {
      section.questions.forEach(q => {
        total++
        const key = `${section.id}-${q.id}`
        const state = questionStates[key]
        if (!state || state.status === QuestionStatus.NOT_VISITED) {
          notVisited++
        } else if (state.status === QuestionStatus.NOT_ANSWERED) {
          notAnswered++
        } else if (state.status === QuestionStatus.ANSWERED) {
          answered++
        } else if (state.status === QuestionStatus.MARKED_REVIEW) {
          markedReview++
        } else if (state.status === QuestionStatus.ANSWERED_MARKED) {
          answeredMarked++
        }
      })
    })

    return { answered, notAnswered, notVisited, markedReview, answeredMarked, total }
  }, [exam, questionStates])

  if (loading || !exam || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Examination...</p>
        </div>
      </div>
    )
  }

  const currentSection = exam.sections[currentSectionIdx]
  const currentQuestion = currentSection?.questions[currentQuestionIdx]
  const time = formatTime(timeRemaining)
  const isTimeWarning = timeRemaining <= 300 // Last 5 minutes warning

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="bg-white shadow border-b-2 border-blue-600 sticky top-0 z-20">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  {exam.title} — {exam.subject}
                </h1>
                <p className="text-xs text-gray-500">National Testing Agency (CBT Mock)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Candidate Name</span>
                <span className="text-sm font-bold text-gray-900">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Examination Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Area: Questions & Controls */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          {/* Section Navigation Tabs */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex gap-2">
              {exam.sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => handlePaletteJump(idx, 0)}
                  className={`py-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    idx === currentSectionIdx
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <span>{section.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    idx === currentSectionIdx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {section.questions.length} Qs
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Body */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 max-w-4xl mx-auto">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded">
                    {currentSection.name}
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Question {currentQuestionIdx + 1}
                  </h2>
                </div>
                <div className="text-sm font-semibold text-gray-500">
                  Marks: <span className="text-green-600">+{exam.marksPerQuestion}</span> | Negative: <span className="text-gray-500">0</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-gray-900 text-base font-medium leading-relaxed mb-6 whitespace-pre-line">
                {currentQuestion.question}
              </div>

              {/* 4 Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIdx) => {
                  const isChecked = selectedOption === optIdx

                  return (
                    <label
                      key={optIdx}
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="exam-option"
                        value={optIdx}
                        checked={isChecked}
                        onChange={() => handleOptionSelect(optIdx)}
                        className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={`font-bold min-w-[24px] ${isChecked ? 'text-blue-700' : 'text-gray-500'}`}>
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className={`text-sm leading-relaxed ${isChecked ? 'text-blue-950 font-semibold' : 'text-gray-800'}`}>
                        {option}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Action Navigation Footer */}
          <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3.5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAndNext}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save & Next
                </button>

                <button
                  onClick={handleClearResponse}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg border border-gray-300 transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
                  title="Clear selected option for this question only"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Response
                </button>

                <button
                  onClick={handleMarkForReviewAndNext}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
                >
                  <Bookmark className="w-4 h-4" />
                  Mark for Review & Next
                </button>
              </div>

              {/* Right Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentSectionIdx === 0 && currentQuestionIdx === 0}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1 text-sm cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={
                    currentSectionIdx === exam.sections.length - 1 &&
                    currentQuestionIdx === currentSection.questions.length - 1
                  }
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow transition-colors flex items-center gap-1 text-sm cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Timer, Legend & Question Palette */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm">
          {/* Unified Countdown Timer */}
          <div className={`p-4 border-b border-gray-200 ${isTimeWarning ? 'bg-red-50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isTimeWarning ? 'text-red-700' : 'text-gray-600'
              }`}>
                <Clock className={`w-4 h-4 ${isTimeWarning ? 'animate-pulse text-red-600' : 'text-blue-600'}`} />
                Time Remaining
              </span>
              {isTimeWarning && (
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full animate-bounce">
                  Hurry Up!
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                <span className={`text-2xl font-black font-mono ${isTimeWarning ? 'text-red-600' : 'text-gray-900'}`}>
                  {time.hours}
                </span>
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Hours</span>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                <span className={`text-2xl font-black font-mono ${isTimeWarning ? 'text-red-600' : 'text-gray-900'}`}>
                  {time.minutes}
                </span>
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Minutes</span>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                <span className={`text-2xl font-black font-mono ${isTimeWarning ? 'text-red-600' : 'text-gray-900'}`}>
                  {time.seconds}
                </span>
                <span className="text-[10px] text-gray-500 block uppercase font-medium">Seconds</span>
              </div>
            </div>
          </div>

          {/* Real-time Status Counts */}
          <div className="p-3 bg-gray-50/80 border-b border-gray-200 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-green-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {summaryCounts.answered}
                </span>
                <span className="text-gray-700 font-medium">Answered</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {summaryCounts.notAnswered}
                </span>
                <span className="text-gray-700 font-medium">Not Answered</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white border border-gray-400 text-gray-700 flex items-center justify-center font-bold text-[10px]">
                  {summaryCounts.notVisited}
                </span>
                <span className="text-gray-700 font-medium">Not Visited</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {summaryCounts.markedReview}
                </span>
                <span className="text-gray-700 font-medium">Marked Review</span>
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <span className="relative w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {summaryCounts.answeredMarked}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                </span>
                <span className="text-gray-700 font-medium">Answered & Marked for Review</span>
              </div>
            </div>
          </div>

          {/* Question Palette Grid by Section */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {exam.sections.map((section, sIdx) => (
              <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    {section.name}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {section.questions.length} Questions
                  </span>
                </div>

                <div className="p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {section.questions.map((q, qIdx) => {
                      const key = `${section.id}-${q.id}`
                      const state = questionStates[key]
                      const isCurrent = sIdx === currentSectionIdx && qIdx === currentQuestionIdx

                      // Palette Color Logic
                      let bgClass = 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400'
                      const status = state?.status

                      if (status === QuestionStatus.ANSWERED) {
                        bgClass = 'bg-green-600 text-white border-2 border-green-700 hover:bg-green-700 shadow-sm'
                      } else if (status === QuestionStatus.NOT_ANSWERED) {
                        bgClass = 'bg-red-600 text-white border-2 border-red-700 hover:bg-red-700 shadow-sm'
                      } else if (status === QuestionStatus.MARKED_REVIEW) {
                        bgClass = 'bg-purple-600 text-white border-2 border-purple-700 hover:bg-purple-700 shadow-sm'
                      } else if (status === QuestionStatus.ANSWERED_MARKED) {
                        bgClass = 'bg-purple-600 text-white border-2 border-purple-700 hover:bg-purple-700 shadow-sm'
                      }

                      return (
                        <button
                          key={key}
                          onClick={() => handlePaletteJump(sIdx, qIdx)}
                          className={`relative h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                            isCurrent ? 'ring-4 ring-blue-500 ring-offset-2 scale-105 z-10 shadow-md font-black' : ''
                          }`}
                          title={`Question ${qIdx + 1} (${status || 'Not Visited'})`}
                        >
                          {qIdx + 1}
                          
                          {/* Green Dot badge for Answered & Marked for Review */}
                          {status === QuestionStatus.ANSWERED_MARKED && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Test Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertTriangle className="w-7 h-7" />
              <h3 className="text-xl font-bold text-gray-900">Confirm Exam Submission</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to submit your exam? Once submitted, you cannot modify your answers.
            </p>

            {/* Submission Summary Table */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 space-y-2.5 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-200 font-bold">
                <span className="text-gray-700">Total Questions</span>
                <span className="text-gray-900">{summaryCounts.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 font-semibold flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-green-600"></span> Answered (Evaluated)
                </span>
                <span className="font-bold text-green-700">{summaryCounts.answered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 font-semibold flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-600"></span> Answered & Review (Evaluated)
                </span>
                <span className="font-bold text-purple-700">{summaryCounts.answeredMarked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 font-semibold flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-600"></span> Not Answered
                </span>
                <span className="font-bold text-red-700">{summaryCounts.notAnswered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600 font-semibold flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-600"></span> Marked for Review (Not Evaluated)
                </span>
                <span className="font-bold text-purple-600">{summaryCounts.markedReview}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-white border border-gray-400"></span> Not Visited
                </span>
                <span className="font-bold text-gray-600">{summaryCounts.notVisited}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm cursor-pointer"
              >
                Cancel & Resume
              </button>
              <button
                onClick={() => handleSubmitTest(false)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition-colors text-sm cursor-pointer"
              >
                Yes, Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
