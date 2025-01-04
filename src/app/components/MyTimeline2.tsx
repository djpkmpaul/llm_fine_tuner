import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function MyTimeline2() {
  const data = [
    {
      title: "Upload Dataset",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Upload your dataset (CSV, JSON, or text). Ensure it's clean and ready for use.
          </p>
        </div>
      ),
    },
    {
      title: "Preprocess Data",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            The platform preprocesses the data for fine-tuning (e.g., tokenization).
          </p>
        </div>
      ),
    },
    {
      title: "Select Base Model",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Choose a pre-trained model (e.g., GPT, BERT) to base the fine-tuning on.
          </p>
        </div>
      ),
    },
    {
      title: "Configure Parameters",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Set parameters (learning rate, epochs, batch size) for fine-tuning.
          </p>
        </div>
      ),
    },
    {
      title: "Start Fine-Tuning",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Initiate fine-tuning with the provided dataset and configuration.
          </p>
        </div>
      ),
    },
    {
      title: "Monitor Progress",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Track real-time progress through charts and logs.
          </p>
        </div>
      ),
    },
    {
      title: "Evaluate Model",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Evaluate model accuracy and metrics post fine-tuning.
          </p>
        </div>
      ),
    },
    {
      title: "Deploy or Download",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Deploy the model or download it for offline use.
          </p>
        </div>
      ),
    },
    {
      title: "Manage Versions",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Manage model versions and make improvements as needed.
          </p>
        </div>
      ),
    },
  ];
  
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
