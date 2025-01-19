'use client'

import { useState } from 'react'
import Header from '../components/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useMySession } from '@/app/helper/MySessionContext'
import { motion } from 'framer-motion'
import { LockIllustration, KeyIllustration } from '@/app/components/Illustrations'
import { HeroHighlight } from '@/components/ui/hero-highlight'

export default function Login() {
  const [user, setUser] = useState({
    username: '',
    password: ''
  })
  const router = useRouter()

  const { userSessionDetails, setUserSessionDetails } = useMySession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', user);
      toast.success(response.data.message);
      router.push("/") // -> LLM table
    } catch (error: any) {
      toast.error(`ERROR: ${error.response.data.error}`);
      setUser({ ...user, username: '', password: '' });

      if (error.response.data.error === "User not found!") {
        router.push(`/register`);
      }

      if (error.response.data.error === "Email not verified") {
        console.log(error.response.data);
        const userEmail = error.response.data.foundUser.email;
        router.push(`/verify?email=${userEmail}`);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <HeroHighlight>
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-xl p-8 space-y-8">
              <div className="flex justify-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <LockIllustration />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <KeyIllustration />
                </motion.div>
              </div>
              <div>
                <motion.h2
                  className="text-center text-3xl font-mono font-extrabold text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Log in to your account
                </motion.h2>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-lg font-medium text-gray-700">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete='current-username'
                      required
                      className="mt-1 block w-full text-lg py-3 px-4"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-lg font-medium text-gray-700">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="mt-1 block w-full text-lg py-3 px-4"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button type="submit" className="w-full text-lg py-6">
                    Log In
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </main>
      </HeroHighlight>
      <Toaster />
    </div>
  )
}

