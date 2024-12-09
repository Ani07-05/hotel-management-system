'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/hooks/useAuth'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const controls = useAnimation()
  const { isAuthenticated, username, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 }
    }))
  }, [controls])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold">HMS</Link>
        <div className="space-x-4">
          {isAuthenticated && (
            <>
              <Link href="/rooms" className="hover:text-gray-300">Rooms</Link>
              <Link href="/guests" className="hover:text-gray-300">Guests</Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-gray-300">Welcome, {username}</span>
              <Button onClick={logout} variant="ghost" className="hover:text-gray-300">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
              <Link href="/signup" className="hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-6xl w-full relative">
          {/* Elegant page border */}
          <div className="absolute inset-0 border-8 border-double border-gray-800 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-12">
            <div className="flex-1 text-center md:text-left">
              <motion.h1 
                style={{
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  backgroundImage: 'linear-gradient(to right, rgb(99, 102, 241), rgb(236, 72, 153), rgb(251, 191, 36))'
                }}
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Welcome to Hotel Management System
              </motion.h1>
              <p className="text-xl mb-8 text-gray-300 max-w-2xl">
                Elevate your hotel operations with our state-of-the-art management solution.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="default">
                  <Link href={isAuthenticated ? "/rooms" : "/login"} className="inline-flex items-center px-6 py-3 text-lg font-semibold">
                    {isAuthenticated ? "View Rooms" : "Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <div className="flex-1">
              <Image
                src="/hotelmg.jpeg"
                alt="Luxury hotel"
                width={800}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

