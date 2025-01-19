'use client'
import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Header from '@/app/components/header'
import { ChatBubbleIllustration, Robot2Illustration, LoadingSpinner } from '@/app/components/Illustrations'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Message {
  type: 'user' | 'bot'
  content: string
}

export default function ChatPage({ params }: { params: Promise<{ token: string }> }) {
  const myParamPromise = React.use(params)
  const myToken = myParamPromise.token

  const [loading, setLoading] = useState<boolean>(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  // Save the chats here
  useEffect(() => {
    console.log("use effect ..unloading");
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log(event);
      console.log("Running onBefore unload");
      event.preventDefault();
      
    } 
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [])

  // First greeting message 
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setMessages([
        { type: 'bot', content: 'Hello! How can I assist you today?' },
      ])
    }, 2000)

    return () => {
      clearTimeout(timer);
    }
  }, [])

  useEffect(() => {
    // it will scroll the chat downwards as the messages increase
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      console.log(messages);
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    setMessages(prev => [...prev, { type: 'user', content: inputMessage }])
    setInputMessage('')

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: `You said: "${inputMessage}". How can I help you with that?` }])
    }, 100)
  }

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }

  return (
    <div id="random" className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center justify-center space-y-4"
              {...motionProps}
            >
              <Robot2Illustration />
              <LoadingSpinner />
              <h2 className="text-2xl font-bold text-gray-800">Loading your chat...</h2>
              <p className="text-gray-600">Please wait a moment</p>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6"
              {...motionProps}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chat {myToken}</h1>
                <ChatBubbleIllustration />
              </div>
              <div
                id='chatContainer'
                ref={chatContainerRef}
                className="space-y-4 mb-4 h-[60vh] overflow-y-auto pr-4"
              >
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                          }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

