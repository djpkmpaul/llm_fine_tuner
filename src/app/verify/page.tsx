"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { error } from 'console'

const VerifyEmail = () => {
    const router = useRouter()
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        const queryUrl = window.location.search
        if(queryUrl){
            const userEmail = queryUrl.split("=")[1]
            setEmail(userEmail)
            router.push('/verify')
        }
    }, [email])
    useEffect(() => {
        if (window !== undefined) {
            // VERIFY
            
            const queryUrl = window.location.search;  // The token passed in the query params
            
            if (queryUrl) {
                const myToken = queryUrl.split("=")[1];
                console.log(myToken);
                setToken(myToken.toString());

                // State wont be updated so send myToken instead of token
                axios.post('/api/users/verifyToken', { token: myToken })
                    .then(response => {
                        console.log(response);
                        toast.success(response.data.message);

                        router.push('/login');
                    })
                    .catch(error => {
                        console.log(error);
                        toast.error(error.response.data.error);
                    })
            }
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // send email
        try {
            const response = await axios.post('/api/users/sendVerificationEmail', { email: email });
            toast.success(`Please visit the link sent to your email - ${email}`);
            console.log(response.data);
        } catch (error: any) {
            console.log("Error occurred ", error.message);
        }
    }
    // Make the input read only
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Toaster />
            <h2 className='text-lg'>Visit the url in your email or paste the link</h2>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                <div className="rounded-md shadow-sm space-y-4">
                    <div>
                        <Label htmlFor="email">email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete='current-email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Button type="submit" className="w-full">
                        Send Email
                    </Button>
                    <Toaster />
                </div>
            </form>

        </div>
    )
}

export default VerifyEmail
