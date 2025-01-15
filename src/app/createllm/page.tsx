"use client"
import React, { useState } from 'react'
import Header from '@/app/components/header'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateNewLLM() {
  const router = useRouter();
  const [llmName, setLlmName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("File will be uploaded");
    console.log(llmName);
  }
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center">
        <Toaster />
        <main className="flex-grow flex flex-col max-w-[75vw] items-center justify-center px-4" style={{ width: "75vw" }}>
          <h2 className="mt-6 text-center text-3xl font-bold font-mono text-gray-900">
            Create Your LLM
          </h2>
          <form className="flex flex-col mt-60" method="post" onSubmit={handleSubmit}>
            <h2 className="mt-6 mb-3 text-center text-2xl font-mono text-gray-900">
              Provide us some details
            </h2>

            <div className="rounded-md shadow-sm space-y-4">
              <Label htmlFor="llmName">LLM Name</Label>
              <Input
                id="llmName"
                name="llmName"
                type="text"
                autoComplete='current-llmName'
                required

                onChange={(e) => {
                  setLlmName(e.target.value);
                }}
              />
            </div>

            <div className="mt-6 rounded-md shadow-sm space-y-4">
              <Label htmlFor="dataset">Upload Dataset</Label>
              <Input
                id="dataset"
                name="dataset"
                type="file"
                accept='.json,.pdf'
                autoComplete='current-dataset'
                required

                onMouseOver={function handleHover(e: any) {
                  e.target.classList.add("cursor-pointer")
                }}

                onChange={(e: React.ChangeEvent) => {
                  console.log(e);
                }}
              />
            </div>
            <div className="mt-6 rounded-md shadow-sm space-y-4">
              <Button type='submit' className='w-[100%]'>
                Create Now
              </Button>
            </div>
          </form>
        </main>
      </div>

    </div>
  )
}
