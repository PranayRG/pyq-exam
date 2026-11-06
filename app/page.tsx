'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, User, Lock, UserPlus, LogIn } from 'lucide-react'
import { findUser, findUserByUsername, saveUser, setCurrentUser, generateId, getCurrentUser, syncAttemptsFromSupabase } from '@/lib/storage'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const user = getCurrentUser()
    if (user) {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isLogin) {
        // Login
        if (!username.trim() || !password.trim()) {
          setError('Please enter both username and password')
          setSubmitting(false)
          return
        }
        const user = await findUser(username.trim(), password)
        if (!user) {
          setError('Invalid username or password')
          setSubmitting(false)
          return
        }
        setCurrentUser(user)
        // Sync user attempts from cloud
        await syncAttemptsFromSupabase(user.id)
        router.push('/dashboard')
      } else {
        // Register
        if (!name.trim() || !username.trim() || !password.trim()) {
          setError('Please fill in all fields')
          setSubmitting(false)
          return
        }
        if (password.length < 4) {
          setError('Password must be at least 4 characters')
          setSubmitting(false)
          return
        }
        const existing = await findUserByUsername(username.trim())
        if (existing) {
          setError('Username already exists. Please choose a different one.')
          setSubmitting(false)
          return
        }
        const newUser = {
          id: generateId(),
          name: name.trim(),
          username: username.trim(),
          password: password,
          createdAt: new Date().toISOString(),
        }
        await saveUser(newUser)
        setCurrentUser(newUser)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-exam-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-exam-blue rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">UGC NET Mock Test</h1>
          <p className="text-gray-500 mt-2">Practice with realistic exam simulations</p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Tab Switch */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                isLogin
                  ? 'bg-white text-exam-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                !isLogin
                  ? 'bg-white text-exam-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-exam-red text-sm p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-exam-blue font-semibold hover:underline"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 UGC NET Mock Test Platform. For educational purposes only.
        </p>
      </div>
    </div>
  )
}
