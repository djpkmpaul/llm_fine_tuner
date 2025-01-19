"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useMySession } from '../helper/MySessionContext'
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function Header() {
  const { userSessionDetails, setUserSessionDetails } = useMySession();
  const [username, setUsername] = useState('');
  const router = useRouter();
  useEffect(() => {
    // to get the username to render on navbar
    const response = axios.get('/api/users/getUserDetails').then((res) => {
      const myToken = res.data.decodedToken
      setUsername(myToken.username);
      setUserSessionDetails({
        ...userSessionDetails,
        username: myToken.username,
        email: myToken.email
      });
    })
      .catch(e => {
        console.log(e);
      })

  }, [username]);

  const logOut = async () => {
    try {
      const response = await axios.post('/api/users/logout');
      toast.success("Successfully logged out");
      router.push('/');
    } catch (error: any) {
      toast.error(`ERROR: ${error.response.data.error}`);
    }
  }
  return (
    <header className="sticky w-[100%] top-0 z-50 py-4 px-6 bg-zinc-800 text-white">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">LLM Fine-tuner</Link>
        {
          userSessionDetails.username && userSessionDetails.email ?
            <div className="space-x-4">

              <Button variant="ghost" asChild>
                <Link href={`/dashboard`}>Welcome {userSessionDetails.username}</Link>
              </Button>

              <Button onClick={logOut} variant="ghost" >
                Log Out
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
    </header>
  )
}

