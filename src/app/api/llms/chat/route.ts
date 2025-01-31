import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import ollama from "ollama";

export async function GET(request: NextRequest) {
    try {
        exec("ollama serve", (error, stdout, stderr) => {
            if (error) {
                console.error("Error starting Ollama:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            if (stderr) {
                console.error("Ollama stderr:", stderr);
            }
            console.log("Ollama started:", stdout);
        });

        return NextResponse.json({ message: "Ollama server started" }, { status: 200 });

    } catch (error: any) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = request.json();
        console.log(data);
        return NextResponse.json({ message: "Your Response : asdasdasdas", success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ message: "Error Occurred", success: true }, { status: 200 });
    }
}