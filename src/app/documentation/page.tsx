"use client"

import React from "react"
import Sidebar from "@/app/components/SidebarComponent"
import { MyTimeline } from "@/app/components/MyTimeline"
import { motion } from "framer-motion"


const Documentation = () => {
    return (
        <div className="flex items-start">
            <Sidebar className="fixed"/>
            <main className="flex-1 p-8">
                <motion.div className="flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl font-mono font-extrabold self-center">Steps to fine-tune your LLM</h1>
                    <MyTimeline />
                </motion.div>
            </main>
        </div>
    )
}

export default Documentation

