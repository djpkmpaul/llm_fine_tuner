
"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Radar chart data: Comparing general LLM vs fine-tuned LLM
const useCaseData = [
  {
    criteria: "Accuracy",
    generalLLM: 80,  
    fineTunedLLM: 90, 
  },
  {
    criteria: "Speed",
    generalLLM: 75,  
    fineTunedLLM: 85, 
  },
  {
    criteria: "Scalability",
    generalLLM: 70,  
    fineTunedLLM: 88, 
  },
  {
    criteria: "Cost Efficiency",
    generalLLM: 60,  
    fineTunedLLM: 80, 
  },
  {
    criteria: "Robustness",
    generalLLM: 78,  
    fineTunedLLM: 90, 
  },
]

const chartConfig = {
  generalLLM: {
    label: "General LLM",
    color: "#2563eb",
  },
  fineTunedLLM: {
    label: "Fine-Tuned LLM",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export default function SpiderChart() {
  return (
    <Card className="ml-3 bg-secondary text-secondary-foreground dark:bg-white">
      <CardHeader className="items-center pb-4">
        <CardTitle className="">Radar Chart - General vs Fine-Tuned LLM</CardTitle>
        <CardDescription>
          Comparing general LLM vs fine-tuned LLM across various metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  max-h-[650px]"
        >
          <RadarChart data={useCaseData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="criteria" />
            <PolarGrid />
            <Radar
              dataKey="generalLLM"
              fill="green"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="fineTunedLLM"
              fill="blue"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
