"use client";
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function PerformanceChart() {
    const chartData = [
        { task: "Summarization", generalLLM: 65, fineTunedLLM: 88 },
        { task: "Sentiment Analysis", generalLLM: 72, fineTunedLLM: 92 },
        { task: "Question Answering", generalLLM: 70, fineTunedLLM: 90 },
        { task: "Translation", generalLLM: 68, fineTunedLLM: 89 },
        { task: "Text Classification", generalLLM: 75, fineTunedLLM: 94 },
        { task: "NER", generalLLM: 60, fineTunedLLM: 87 },
        { task: "Chat Systems", generalLLM: 62, fineTunedLLM: 90 },
    ];

    const chartConfig = {
        generalLLM: {
            label: "General LLM",
            color: "#2563eb", // Blue for general LLM
        },
        fineTunedLLM: {
            label: "Fine-Tuned LLM",
            color: "#60a5fa", // Light Blue for fine-tuned LLM
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>Fine-tuning v/s General Purpose LLM</CardTitle>
                <CardDescription>
                    Comparing performance of general LLM and fine-tuned LLM for various tasks.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <div className="bg-secondary text-secondary-foreground dark:bg-white">
                    <p className="py-3 m-3" ></p>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-[50vw]">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="task"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 20)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                                dataKey="generalLLM"
                                fill={chartConfig.generalLLM.color}
                                radius={4}
                            />
                            <Bar
                                dataKey="fineTunedLLM"
                                fill={chartConfig.fineTunedLLM.color}
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </div >
            </CardContent>
        </Card>
    );
}
