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
        console.log("Chat page - POST request Recieved");
        const data = await request.json();
        const llmName = data.llmName;
        const inputMessage = data.inputMessage;
        console.log(data);
        const response = await ollama.chat({
            model: `LegacyPaul0809/${llmName}`,
            messages: [{ role: 'user', content:inputMessage }],
        })
        console.log(response.message.content)
        console.log(response)
        return NextResponse.json({ message: response.message.content, success: true }, { status: 200 });
    } catch (error:any) {
        console.log(error);

        return NextResponse.json({error:error.message, success: true }, { status: 500});
    }
}