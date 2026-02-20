import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
      }
      await signIn(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-forest-500 to-forest-600 px-6 pt-16 pb-12 text-center">
        <p className="text-forest-100 text-sm leading-normal mb-1">Materials Tracker</p>
        <h1 className="text-4xl font-bold text-white leading-tight">Bloom</h1>
        <p className="text-forest-200 text-sm leading-normal mt-3">Track materials for every job</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-bold text-forest-800 text-center">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-forest-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-forest-200 rounded-xl text-sm focus:outline-none focus:border-forest-400 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-forest-200 rounded-xl text-sm focus:outline-none focus:border-forest-400 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-14 bg-forest-500 text-cream-50 rounded-2xl font-semibold text-base disabled:bg-forest-200 disabled:text-forest-400"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-forest-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError('') }}
              className="text-forest-500 font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
