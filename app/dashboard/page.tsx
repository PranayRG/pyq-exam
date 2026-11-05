'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, LogOut, ChevronDown, Clock, Award, FileText, Play, RotateCcw, Eye } from 'lucide-react'
import { getCurrentUser, logout, getAttemptsByExam } from '@/lib/storage'
import { User, ExamAttempt } from '@/lib/types'
import { exams, getAvailableExamTypes, getAvailableSubjects, getExamsBySubject } from '@/data/exams'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/')
      return
    }
    setUser(currentUser)
    
    // Set defaults
    const examTypes = getAvailableExamTypes()
    if (examTypes.length > 0) {
      setSelectedExam(examTypes[0])
      const subjects = getAvailableSubjects(examTypes[0])
      if (subjects.length > 0) {
        setSelectedSubject(subjects[0])
      }
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleExamChange = (examType: string) => {
    setSelectedExam(examType)
    const subjects = getAvailableSubjects(examType)
    setSelectedSubject(subjects.length > 0 ? subjects[0] : '')
  }

  const filteredExams = selectedExam && selectedSubject
    ? getExamsBySubject(selectedExam, selectedSubject)
    : []

  const getExamAttemptInfo = (examId: string) => {
    if (!user) return { attempts: [] as ExamAttempt[], lastCompleted: null as ExamAttempt | null, hasActive: false }
    const attempts = getAttemptsByExam(user.id, examId)
    const completed = attempts.filter(a => a.completed)
    const lastCompleted = completed.length > 0
      ? completed.sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]
      : null
    const hasActive = attempts.some(a => !a.completed)
    return { attempts, lastCompleted, hasActive }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-exam-blue"></div>
      </div>
    )
  }

  const examTypes = getAvailableExamTypes()
  const subjects = selectedExam ? getAvailableSubjects(selectedExam) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-exam-blue rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">UGC NET Mock Test</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-exam-red transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selection Dropdowns */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Exam</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Exam Type
              </label>
              <div className="relative">
                <select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">-- Select Exam --</option>
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Subject Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject / Specialization
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-field appearance-none pr-10"
                  disabled={!selectedExam}
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Exam Tiles */}
        {selectedExam && selectedSubject && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Available Papers - {selectedSubject}
            </h2>
            
            {filteredExams.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No papers available for this selection yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map(exam => {
                  const { lastCompleted, hasActive, attempts } = getExamAttemptInfo(exam.id)
                  const completedCount = attempts.filter(a => a.completed).length
                  const totalQuestions = exam.sections.reduce((sum, s) => sum + s.questions.length, 0)

                  return (
                    <div key={exam.id} className="card hover:shadow-lg transition-shadow duration-200 flex flex-col">
                      {/* Exam Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-exam-blue text-xs font-semibold rounded-full">
                          {exam.exam}
                        </span>
                        <span className="px-2.5 py-0.5 bg-purple-100 text-exam-purple text-xs font-semibold rounded-full">
                          {exam.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">{exam.subject}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-900">{totalQuestions}</p>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <Award className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-900">{exam.totalMarks}</p>
                          <p className="text-xs text-gray-500">Marks</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-900">{exam.durationMinutes}</p>
                          <p className="text-xs text-gray-500">Minutes</p>
                        </div>
                      </div>

                      {/* Sections info */}
                      <div className="text-xs text-gray-500 mb-4 space-y-1">
                        {exam.sections.map(section => (
                          <div key={section.id} className="flex justify-between">
                            <span>{section.name}</span>
                            <span className="font-medium">{section.questions.length} Qs</span>
                          </div>
                        ))}
                      </div>

                      {/* Previous Score */}
                      {lastCompleted && lastCompleted.score && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-700 font-medium">Last Score</span>
                            <span className="text-lg font-bold text-green-700">
                              {lastCompleted.score.obtainedMarks}/{lastCompleted.score.totalMarks}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {lastCompleted.score.percentage.toFixed(1)}% • Attempted {completedCount} time{completedCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto pt-2 flex gap-2">
                        {hasActive ? (
                          <button
                            onClick={() => router.push(`/exam/${exam.id}`)}
                            className="btn-warning flex-1 flex items-center justify-center gap-2 text-sm"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Resume Exam
                          </button>
                        ) : (
                          <button
                            onClick={() => router.push(`/instructions/${exam.id}`)}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                          >
                            <Play className="w-4 h-4" />
                            {completedCount > 0 ? 'Retake Exam' : 'Start Exam'}
                          </button>
                        )}
                        {lastCompleted && (
                          <button
                            onClick={() => router.push(`/result/${exam.id}/${lastCompleted.id}`)}
                            className="btn-secondary flex items-center justify-center gap-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Result
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
