'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { toast } from 'sonner'
import { useAuth } from '@/src/hooks/useAuth'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
      toast.success('Login successful')
      router.push('/')
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      console.error('Error during login', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">HMS</Link>
      </nav>
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="p-8">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white mb-8">
              Sign in to your account
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent border-white focus:ring-white focus:border-white text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-white focus:ring-white focus:border-white text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-600 group-hover:text-gray-800" aria-hidden="true" />
                    </span>
                    Sign in
                  </Button>
                </motion.div>
              </div>
            </form>
            <div className="text-center mt-6">
              <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
