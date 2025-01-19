"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { motion } from 'framer-motion'
import { EmailVerificationIllustration, CheckmarkIllustration } from '@/app/components/Illustrations'

const VerifyEmail = () => {
    const router = useRouter()
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const queryUrl = window.location.search
        if (queryUrl) {
            const [queryParam, userEmail] = queryUrl.split("=")
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
                if (queryUrl.split("=")[0] !== '?email') {
                    // State wont be updated so send myToken instead of token
                    let successMsg, errorMsg;
                    toast.promise(
                        axios.post('/api/users/verifyToken', { token: myToken })
                        .then(response => {
                            successMsg = response.data.message;
                            toast.success(response.data.message)
                            router.push('/login');
                        })
                        .catch(error => {
                            errorMsg = error.response.data.error;
                            toast.error(error.response.data.error)
                            console.log(error);
                        }),
                        {
                            loading: 'Decoding your token...',
                            success: successMsg && `${successMsg}`,
                            error: errorMsg && `${errorMsg}`
                        }
                    )
                }
            }
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // send email
        try {
            const response = await axios.post('/api/users/sendVerificationEmail', { email: email });
            toast.success(response.data.message)
            if(response.data.message === "User is already verified")
                {
                    router.push('/login')
                }
            } catch (error: any) {
                console.log("Error occurred ", error.message);
                toast.error(error.data.message)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
            <Toaster />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center space-x-4 mb-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <EmailVerificationIllustration />
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <CheckmarkIllustration />
                            </motion.div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
                        <CardDescription className="text-center">
                            Visit the URL in your email or paste the link
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-lg font-medium text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete='current-email'
                                    required
                                    className="w-full text-lg py-3 px-4"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    readOnly
                                />
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button type="submit" className="w-full text-lg py-6">
                                    Send Verification Email
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default VerifyEmail

