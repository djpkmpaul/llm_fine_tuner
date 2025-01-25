"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz, ColDef } from "ag-grid-community";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardIllustration, RobotIllustration, ChattingIllustration } from "@/app/components/Illustrations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMySession } from '@/app/helper/MySessionContext'
import axios from "axios";
import { error } from "console";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DashBoard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { userSessionDetails, setUserSessionDetails, sessionLoaded, setSessionLoaded } = useMySession();
    const [fetchedData, setFetchedData] = useState(false)
    const agGridTheme = themeQuartz.withParams({
        fontSize: "16px",
        dataFontSize: "14px",
        fontFamily: "Roboto, sans-serif",
        spacing: 8,
        accentColor: "#4caf50",
        headerFontFamily: "Roboto, sans-serif",
        headerCellHoverBackgroundColor: "#37474f",
        headerTextColor: "#ffffff",
        headerBackgroundColor: "#263238",
        headerFontWeight: 700,
        rowHoverColor: "#e8f5e9",
        borderColor: "#b0bec5",
        cellHorizontalPadding: "10px",
        rowVerticalPaddingScale: 2,
        oddRowBackgroundColor: "#eceff1",
        headerFontSize: "18px",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handling Click..");
    };

    const DeleteBtn = (params: any) => {
        function handleDeleteClick() {
            toast.success(`deleting ${params.data.chat}`)
            axios.post("/api/llms/deletellm", {
                tokenId: params.data.chat
            }).then((response) => {
                toast.success(`Response - ${response.data.message}`);
            }).catch((error: any) => {
                toast.error(error.response.data.error);
            })
        }
        return (
            <Button onClick={handleDeleteClick} variant="destructive">
                Delete LLM
            </Button>
        );
    };

    const APIEndPointBtn = (params: any) => {
        const handleClick = () => {
            const apiEndPoint = params.data.apiEndPoint;
            navigator.clipboard.writeText(apiEndPoint).then(() => {
                toast.success("API endpoint copied to clipboard!");
            }).catch((err) => {
                toast.error("Failed to copy API endpoint.");
                console.error(err);
            });
        };
        const content = "API Endpoint - " + params.data.apiEndPoint.substring(0, 15) + "..."
        return (
            <Button onClick={handleClick} className="w-[100%] rounded-none text-start" variant="link">
                <a href={`${params.data.apiEndPoint}`} target="_blank" rel="noopener noreferrer">{content}</a>
            </Button>
        );
    };

    const chatPageBtn = (params: any) => {
        const handleChatClick = () => {
            console.log(`/chat/${params.value}`);
            router.push(`/chat/${params.value}`);
        }
        return (
            <Button onClick={handleChatClick} variant="secondary">
                Chat Page
            </Button>
        )
    }

    interface RowData {
        llmName: string;
        apiEndPoint: string;
        chat: string;
        deleteBtn: Function | string;
    }


    const [rowData, setRowData] = useState<RowData[]>([
        {
            llmName: "MySQL FineTuned LLM",
            apiEndPoint: "https://api.example.com/llm/mysql",
            chat: "nx6nw71ixw4nxsdj",
            deleteBtn: "Delete LLM",
        },
        {
            llmName: "Local Language LLM",
            apiEndPoint: "https://api.example.com/llm/local",
            chat: "21tq2csql79boqyo",
            deleteBtn: "Delete LLM",
        },
        {
            llmName: "Fourier Transform Fine Tuned LLM",
            apiEndPoint: "https://api.example.com/llm/fourier",
            chat: "3p2alum5617p389m",
            deleteBtn: "Delete LLM",
        },
        {
            llmName: "Legal Document Fine Tuned LLM",
            apiEndPoint: "https://api.example.com/llm/legal",
            chat: "ch6jkmmzrr952nla",
            deleteBtn: "Delete LLM",
        },
    ]);

    const [colDefs, setColDefs] = useState<ColDef[]>([
        { field: "llmName", flex: 1, headerName: "LLM Name" },
        { field: "apiEndPoint", flex: 1, cellRenderer: APIEndPointBtn, headerName: "API Endpoint" },
        { field: "chat", flex: 1, cellRenderer: chatPageBtn, headerName: "Chat" },
        { field: "delete LLM", flex: 1, cellRenderer: DeleteBtn, headerName: "Actions" },
    ]);

    useEffect(() => {
        // Simulate loading delay
        // -> make the loading false after mouting.
        /* const timer = setTimeout(() => {
            setIsLoading(false);
            }, 1500);
            
            return () => clearTimeout(timer); */
        if (sessionLoaded) {
            setIsLoading(false);
        }

    }, [sessionLoaded]);
    useEffect(() => {
        try {
            let username;
            username = userSessionDetails.username;
            sessionLoaded ? console.log("making a post request directly.. ") : console.log("Waiting for Session to Load")
            if (sessionLoaded)
                axios
                    .post('/api/llms/getAllLLMs', { username }).then(postRes => {
                        const llmData = postRes.data.foundUser.llms
                        console.log(llmData);
                        const llmRowData = llmData.map((item: any, key: any) => {
                            const api = `https://api.example.com/llm/${item.name.split(" ").join("_").toString()}`
                            return { llmName: item.name, apiEndPoint: api, chat: item.tokenId, deleteBtn: "Delete LLM" }
                        })
                        console.log("llmRowData");
                        console.log(llmRowData);
                        setRowData(llmRowData)
                        setFetchedData(true)
                    }).catch(err => {
                        console.log(err);
                    })
        } catch (error: any) {
            console.log(error.response.data);
        }
    }, [sessionLoaded])
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 1}}
            transition={{delay: 0.5, type: "spring", bounce: 0.52}}
            className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white"
        >
            <HeroHighlight>
                <AnimatePresence>
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-screen"
                        >
                            <RobotIllustration />
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold mt-4"
                            >
                                Loading your LLMs...
                            </motion.h2>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-start p-8 w-[70vw] max-w-7xl mx-auto"
                        >
                            <Toaster />
                            <div className="w-full flex justify-between items-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                                >
                                    <DashboardIllustration />
                                </motion.div>
                                <div>
                                    <motion.h1
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl font-bold text-gray-900 mb-2"
                                    >
                                        Your Dashboard
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-xl text-gray-600"
                                    >
                                        Manage your custom LLMs
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button onClick={() => router.push('/createllm')} size="lg">
                                        Create New LLM
                                    </Button>
                                </motion.div>
                            </div>

                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Your LLMs</CardTitle>
                                    <CardDescription>Here's a list of all your custom Language Models</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="h-[30vh] w-full overflow-auto"
                                    >
                                        <AgGridReact
                                            rowData={rowData}
                                            columnDefs={colDefs}
                                            theme={agGridTheme}
                                            animateRows={true}
                                            enableCellTextSelection={true}
                                            suppressMovableColumns={true}
                                            suppressColumnVirtualisation={true}
                                            domLayout="autoHeight"
                                        />
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </HeroHighlight>
        </motion.div>
    );
}

