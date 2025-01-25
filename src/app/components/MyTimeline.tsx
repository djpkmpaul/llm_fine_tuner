'use client'
import React, { useEffect, useRef } from "react";
import { Timeline } from "@/components/ui/timeline";
import { AnimatePresence, motion, useInView } from "framer-motion";


export function MyTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    amount: 1
  })

  const animationOption = {
    initial: { opacity: 0, x: -200, scale: 0.8 },
    whileInView: { opacity: 1, x: 0, scale: 1 },
    transition: { delay: .3, type: 'spring', bounce: 0.5 }
  }
  const contentData = [
    {
      title: "Upload Dataset",
      p: "Upload your dataset (CSV, JSON, or text). Ensure it's clean and ready for use.",
      imgSrc: ['/1_upload_data.svg'],
    },
    {
      title: "Preprocess Data",
      p: "The platform preprocesses the data for fine-tuning (e.g., tokenization).",
      imgSrc: ['/2_preprocess.svg', '/2_token.png']
    },
    {
      title: "Select Base Model",
      p: "Choose a pre-trained model (e.g., GPT, BERT) to base the fine-tuning on.",
      imgSrc: ['/3_ai.svg', '/3_choose_model_removebg.png']
    },
    {
      title: "Configure Parameters",
      p: "Set parameters (learning rate, epochs, batch size) for fine-tuning.",
      imgSrc: ['/4_set_params.svg']
    },
    {
      title: "Start Fine-Tuning",
      p: "Initiate fine-tuning with the provided dataset and configuration.",
      imgSrc: ['/5_fine_tuning.svg']
    },
    {
      title: "Monitor Progress",
      p: "Track real-time progress through charts and logs.",
      imgSrc: ['/6_monitor.svg', '/6_progress.svg']
    },
    {
      title: "Evaluate the Model",
      p: "Evaluate model accuracy and metrics post fine-tuning.",
      imgSrc: ['/7_evaluate.svg', '/7_analyse.svg']
    },
    {
      title: "Deploy or Download",
      p: "Deploy the model or download it for offline use.",
      imgSrc: ['/8_download.png']
    },
  ]
  const data = contentData.map((content, idx) => {
    return (
      {
        title: content.title,
        content: (
          <motion.div

            key={idx}
            ref={ref}
          >
            <motion.p
              {...animationOption}
              className="text-neutral-800 dark:text-neutral-200 text-3xl font-mono mb-8">
              {content.p}
            </motion.p>

            <div className="flex flex-wrap">
              {content.imgSrc.map((src, imgIdx) => {
                return (
                  <motion.img
                    className="my-3 aspect-auto bg-cover"
                    key={imgIdx}
                    src={src}
                    alt={src}
                    {...
                    // 1. adding hover effect
                    // 2. delay in rendering the images
                    {
                      ...animationOption,
                      whileHover: {

                        scale: 1.05, transition: { delay: .001, type: 'linear' }
                      },
                      transition:
                      {
                        ...animationOption.transition,
                        delay: 0.4 +  0.3*(imgIdx)
                      }
                    }}
                  />
                )
              })}
            </div>
          </motion.div >
        ),
      }
    )
  })

  return (
    <div className="w-full">
      <AnimatePresence>
        <Timeline data={data} />
      </AnimatePresence>
    </div>
  );
}
