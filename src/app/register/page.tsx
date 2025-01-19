'use client'

import { useState } from 'react'
import Header from '../components/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { motion } from 'framer-motion'
import { UserPlusIllustration, ShieldCheckIllustration } from '@/app/components/Illustrations'
import { HeroHighlight } from '@/components/ui/hero-highlight'

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/users/signup', user);
      toast.success(`${response.data.message}`)
      const emailResponse = await axios.post('/api/users/sendVerificationEmail', { email: user.email })
      toast.success(`Mail sent. Please Verify Email`);
      setUser({
        username: '',
        email: '',
        password: ''
      })
      router.push('/verify')
    } catch (error: any) {
      console.log(error.response.data);
      toast.error(`ERROR: ${error.response.data.error}`);
      router.push('/register');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <HeroHighlight>
        <Toaster />

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
                  <UserPlusIllustration />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <ShieldCheckIllustration />
                </motion.div>
              </div>
              <div>
                <motion.h2
                  className="text-center text-3xl font-extrabold text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Create your account
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
                      autoComplete="username"
                      required
                      className="mt-1 block w-full text-lg py-3 px-4"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-address" className="text-lg font-medium text-gray-700">Email address</Label>
                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-1 block w-full text-lg py-3 px-4"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-lg font-medium text-gray-700">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
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
                    Register
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </main>
      </HeroHighlight>
    </div>
  )
}

