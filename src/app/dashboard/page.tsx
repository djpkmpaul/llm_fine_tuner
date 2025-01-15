"use client";
import Header from "@/app/components/header";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz, ColDef } from "ag-grid-community";


import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

ModuleRegistry.registerModules([AllCommunityModule]);
export default function DashBoard() {
    const router = useRouter();
    const agGridTheme = themeQuartz.withParams({
        fontSize: "16px", // More standard and readable font size
        dataFontSize: "14px", // Slightly smaller for better readability
        fontFamily: "Roboto, sans-serif", // Clean and modern font
        spacing: 8, // Reduced spacing for a sleeker design
        accentColor: "#4caf50", // Soft green for row hover (pleasant and subtle)
        
        
        
        headerFontFamily: "Roboto, sans-serif", 
        headerCellHoverBackgroundColor: "#37474f", // Dark gray-blue for subtle hover effect
        headerTextColor: "#ffffff", // White for good contrast
        headerBackgroundColor: "#263238", // Darker gray-blue for a modern look
        headerFontWeight: 700, // Bold for clarity and emphasis
        
        // Additional parameters for enhanced appearance
        rowHoverColor: "#e8f5e9", // Light green background for hovered rows
        borderColor: "#b0bec5", // Subtle border to separate rows and columns
        cellHorizontalPadding: "10px", // Consistent cell padding
        rowVerticalPaddingScale: 2, // Consistent cell padding
        oddRowBackgroundColor: "#eceff1", // Light gray for zebra striping effect
        headerFontSize: "18px", // Slightly larger header font for emphasis
    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handling Click..");
    };
    
    const DeleteBtn = (params: any) => {
        function handleDeleteClick(clickEvent: any) {
            console.log("deleting LLM");
        }
        return (
            <Button
            onClick={handleDeleteClick}
            >
                Delete LLM
            </Button>
        );
    };

    // Corrected APIEndPointBtn to copy the endpoint and show toast
    const APIEndPointBtn = (params: any) => {
        const handleClick = () => {
            console.log("clicked api btn");
            console.log(params);

            const apiEndPoint = params.data.apiEndPoint;
            navigator.clipboard.writeText(apiEndPoint).then(() => {
                toast.success("API endpoint copied to clipboard!");
            }).catch((err) => {
                toast.error("Failed to copy API endpoint.");
                console.error(err);
            });
        };
        
        return (
            <button onClick={handleClick}>
                Get API Endpoint
            </button>
        );
    };

    const chatPageBtn = (params: any) => {
        const handleChatClick = () => {
            console.log(`/chat/${params.value}`)
            router.push(`/chat/${params.value}`)
        }
        return (
            <Button onClick={handleChatClick}>
                Chat Page
            </Button>
        )
    }
    
    interface RowData  {
        llmName: String,
        apiEndPoint: String,
        chat: String,
        deleteBtn: Function | String
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
        { field: "llmName", flex: 1 },
        { field: "apiEndPoint", flex: 1, cellRenderer: APIEndPointBtn },
        { field: "chat", flex: 1, cellRenderer: chatPageBtn},
        { field: "delete LLM", flex: 1, cellRenderer: DeleteBtn },
    ]);

    return (
        <div>
            
            <Header />
            <div className="flex flex-col items-center">
                <Toaster />
                <main className="flex-grow flex flex-col max-w-[75vw] items-center justify-center px-4" style={{width: "75vw"}}>

                    <Button className="mt-6 self-end" onClick={() => {
                        router.push('/createllm')
                    }}>
                        Create New LLM
                    </Button>

                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Your Dashboard
                            </h2>
                        </div>
                    </div>

                    <form className="mt-6" onSubmit={handleSubmit} style={{width: "75vw"}}>
                        <div
                            className="self-center"
                            style={{ height: "32vh", width: "100%"}}
                        >
                            <AgGridReact rowData={rowData} columnDefs={colDefs} theme={agGridTheme} />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
