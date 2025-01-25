"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useMySession } from '../helper/MySessionContext'
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion"
import { Separator } from '@/components/ui/separator';

export default function Header() {
  const { userSessionDetails, setUserSessionDetails, sessionLoaded, setSessionLoaded } = useMySession();
  const [username, setUsername] = useState('');
  const router = useRouter();
  useEffect(() => {
    console.log("Fetching session details...");
    if (sessionLoaded == false)
      // Fetch session details
      axios
        .get('/api/users/getUserDetails')
        .then((res) => {
          const myToken = res.data.decodedToken;
          console.log("Setting context data:", myToken);
          // Update local state and context
          setUsername(myToken.username);
          setUserSessionDetails({
            username: myToken.username,
            email: myToken.email,
          });

          setSessionLoaded(true)
        })
        .catch((e: any) => {
          console.log(e.message);
        })

  }, [userSessionDetails.username]);

  const logOut = async () => {
    try {
      const response = await axios.post('/api/users/logout');
      toast.success("Successfully logged out");
      setSessionLoaded(false);
      setUserSessionDetails({
        username: '',
        email: '',
      });
      router.push('/');
    } catch (error: any) {
      toast.error(`ERROR: ${error.response.data.error}`);
    }
  }
  return (
    <motion.header
      initial={{ scaleX: 0 }}
      animate={{scaleX: 1 }}
      exit={{ x: 2000 }}
      transition={{ delay: 0.5, type: "spring", bounce: 0.1 }}
      className="sticky w-[100%] top-0 z-50 py-4 px-6 bg-zinc-800 text-white"
    >
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">LLM Fine-tuner</Link>
        
        {
          userSessionDetails.username && userSessionDetails.email ?
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link href={`/dashboard`}>Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/createllm`}>Create New LLM</Link>
              </Button>
              <Button onClick={logOut} className='text-slate-50 bg-zinc-700' variant="ghost" >
                Log Out
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/dashboard`} className='text-slate-50 bg-zinc-700'>{userSessionDetails.username}</Link>
              </Button>
            </div>

            :

            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
        }
      </nav>
      <Toaster />
    </motion.header>
  )
}

