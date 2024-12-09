'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { toast } from 'sonner'

export default function Signup() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success('Signup successful! Redirecting to login...')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        if (data.error === 'Username already exists') {
          toast.error('Username already exists. Please choose a different username.')
        } else {
          toast.error(data.error || 'Signup failed')
        }
      }
    } catch (error) {
      toast.error('Error during signup')
      console.error('Error during signup', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">HMS</Link>
      </nav>
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="border-2 border-white p-8 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white mb-8">
              Create your account
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
                    autoComplete="new-password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-white focus:ring-white focus:border-white text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      <UserPlus className="h-5 w-5 text-gray-600 group-hover:text-gray-800" aria-hidden="true" />
                    </span>
                    Sign up
                  </Button>
                </motion.div>
              </div>
            </form>
            <div className="text-center mt-6">
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

