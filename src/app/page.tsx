import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

import { Button } from "@/components/ui/button"
import { HeroHighlight } from "@/components/ui/hero-highlight";
import Link from 'next/link'

import PerformaceChart from '@/app/components/PerformaceChart'
import SpiderChart from '@/app/components/SpiderChart'
import { MyTimeline } from "@/app/components/MyTimeline";
import Header from '@/app/components/header'
import MyMarquee from "@/app/components/MyMarquee";


export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="min-h-[100vh] flex-grow flex flex-col items-center justify-center text-center px-4">
        <BackgroundBeamsWithCollision className="flex flex-col">
          <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-mono font-extrabold text-center text-black dark:text-white tracking-tight">
            Welcome to LLM {" "}
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="font-mono font-extrabold">Fine-tuner.</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                <span className="font-mono font-extrabold">Fine-tuner.</span>
              </div>
            </div>
          </h2>
          <p className="text-xl mb-8 max-w-2xl font-mono">
            Enhance your Language Models with our state-of-the-art fine-tuning platform.
            Improve accuracy, adapt to specific domains, and unlock new possibilities.
          </p>
          <div className="space-x-4">
            <Button className='bg-zinc-700' asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#charts">Check out</Link>
            </Button>
          </div>
        </BackgroundBeamsWithCollision>
      </main>

      <HeroHighlight>
        <div className="stats h-[125vh]">
          <div id='charts' className="flex flex-col min-h-screen justify-center items-center">
            <h1 className="text-2xl relative z-20 font-bold text-center text-black dark:text-white font-mono tracking-tight">Why Fine Tune?</h1>
            <p className="p-3 max-w-[1100px] text-justify text-xl relative z-20 text-black dark:text-white font-mono tracking-tight">Fine-tuning is the secret to transforming your models from good to great. It's the key to unlocking their full potential, enabling them to adapt specifically to your unique data and goals. Just like how a skilled artist refines their masterpiece, fine-tuning tailors pre-trained models to deliver maximum accuracy and efficiency for your specific needs.By fine-tuning, you can significantly enhance performance without needing to start from scratch. It's cost-effective, fast, and provides the flexibility to adapt to new challenges. With fine-tuning, your models become smarter, more precise, and better equipped to handle real-world complexity.
              See the difference in action below with charts and illustrations that showcase how fine-tuning boosts precision, minimizes errors, and maximizes the value of your model. Fine-tuning is the powerful tool that takes your model to the next level—perfecting it for your business, your data, and your goals.</p>

            <div className="flex flex-start">
              <PerformaceChart />
              <SpiderChart />
            </div>
          </div>
        </div>

        <div className="m-6 py-6 flex flex-col min-h-screen justify-center items-center">
          <h1 className="m-6 text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">How to Fine-Tune?</h1>
          <MyTimeline />
        </div>

        <div className="">
          <MyMarquee />
        </div>
      </HeroHighlight>
      <footer className="py-4 text-center bg-gray-100">
        © 2023 LLM Fine-tuner. All rights reserved.
      </footer>
    </div>
  )
}

