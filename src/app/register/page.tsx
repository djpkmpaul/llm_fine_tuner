'use client'

import { useState } from 'react'
import Header from '../components/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  }) 
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/users/signup', user);
      toast.success("here is your toast")
      setUser({
        username: '',
        email: '',
        password: ''
      })
      router.push('/login')
    } catch (error : any) {
      toast.error(`ERROR: ${error.response.data.error}`);
      router.push('/register');
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="email"
                  required
                  value={user.username}
                  onChange={(e) => setUser({...user, username:e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={user.email}
                  onChange={(e) => setUser({...user, email:e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={user.password}
                  onChange={(e) => setUser({...user, password:e.target.value})}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Register
              </Button>
              <Toaster></Toaster>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

