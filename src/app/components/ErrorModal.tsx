import React from 'react'
import { motion } from 'framer-motion'
import { X, Copy, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  llmName: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, llmName }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md "
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Model Not Found</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="mb-6">
          <img src="/error-illustration.svg" alt="Error Illustration" className="w-full h-40 object-contain" />
        </div>

        <div className="space-y-4">
          <p className="text-lg">Follow these steps to resolve the issue:</p>

          <ol className="list-decimal list-inside space-y-2">
            <li className='my-2 p-2'>Install Ollama by visiting <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://ollama.com/download</a></li>
            
            <li className='my-2 p-2'>
              Run the command:
              <div className="bg-gray-100 p-2 rounded-md flex justify-between items-center mt-1">
                <code className='text-sm font-bold'>ollama serve</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('ollama serve')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </li>

            <li className='my-2 p-2'>
              Pull the model:
              <div className="bg-gray-100 p-2 rounded-md flex justify-between items-center mt-1">
                <code className='text-sm font-bold'>{`ollama pull LegacyPaul/${llmName}`}</code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`ollama pull LegacyPaul/${llmName}`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </li>

            <li className='my-2 p-2'>Reload the chat page</li>
          </ol>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ErrorModal
