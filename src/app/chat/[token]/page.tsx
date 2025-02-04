"use client"
import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { ChatBubbleIllustration, Robot2Illustration, LoadingSpinner } from '@/app/components/Illustrations'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
import ErrorModal from '@/app/components/ErrorModal'
interface Message {
  type: 'user' | 'bot'
  content: string
}

export default function ChatPage({ params }: { params: Promise<{ token: string }> }) {
  const myParamPromise = React.use(params)
  const llmName = myParamPromise.token // llmName

  const [loading, setLoading] = useState<boolean>(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [ollamaRunning, setOllamaRunning] = useState(false);
  const [modelPulled, setModelPulled] = useState(true);
  const [canChat, setCanChat] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  useEffect(() => {
    // when the page is first loaded 
    // make axios get request to /api/llms/chat -> to setUp ollama server
    if (ollamaRunning == false) {
      axios.get('http://localhost:11434/')
        .then((ollamaResponse) => {
          // make a request to ollama port directly. If it is online then 
          console.log(ollamaResponse);
          setOllamaRunning(true);
        }).catch((error) => {
          axios.get('/api/llms/chat')
            .then((response) => {
              console.log(response);
              setOllamaRunning(true);
            })
            .catch((error: any) => {
              console.log(error);
            })
        })
    }
  }, [ollamaRunning])

  useEffect(() => {
    // make post request to /api/llms/pull-model
    if (modelPulled == false) {
      axios.post('/api/llms/pull-model', { modelName: llmName })
        .then((response) => {
          console.log(response);
          setModelPulled(true);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [modelPulled])

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

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return
    setCanChat(false)
    console.log(inputMessage);
    try {
      console.log(`Sending post request to LegacyPaul0809/${llmName}`);
      setMessages(prev => [...prev, { type: 'user', content: inputMessage }])
      setInputMessage('')

      const response = await axios.post('/api/llms/chat', { inputMessage, llmName });
      console.log("OLLAMA RESPONSE - ", response);
      console.log(response.data);

      const answer = response.data.message
      console.log(answer);

      // Simulate bot response
      setMessages(prev => [...prev, { type: 'bot', content: answer }])
      setCanChat(true)
    } catch (error: any) {
      console.log(error);
      setCanChat(true)
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
      const myError = error.response.data.error;
      if (myError == `model "LegacyPaul0809/${llmName}" not found, try pulling it first`) {
        console.log("setting model pulled to FALSE");
        // setModelPulled(false);
        setIsErrorModalOpen(true)
      }
    }
  }

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }

  return (
    <div id="random" className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
              <Toaster />
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chat {llmName}</h1>
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
              {
                modelPulled === false ?
                  (

                    <div className="flex justify-center">
                      <LoadingSpinner />
                      <Button type='button' variant="ghost" className='ml-3 text-xl font-mono w-[80%]'>please wait till we download the your model</Button>
                    </div>
                  )
                  :
                  (

                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && canChat && handleSendMessage()}
                        className="flex-grow"
                      />
                      <>
                        {canChat ?
                          <Button onClick={handleSendMessage} disabled={!canChat} >Send</Button>
                          :
                          <div className='flex justify-center'>
                            <Button onClick={handleSendMessage} disabled={!canChat} >Send</Button>
                            <LoadingSpinner />
                          </div>
                        }
                      </>
                    </div>
                  )
              }
            </motion.div>
          )}
        </AnimatePresence>
        <ErrorModal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} llmName={llmName} />
      </main>
    </div>
  )
}

// "Can you help me find related materials of Bohr Radius?