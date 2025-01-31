import { NextRequest, NextResponse } from "next/server";
import ollama from 'ollama';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const modelName = data.modelName;
        console.log(`PULLING LegacyPaul0809/${modelName}`);

        const startTime = Date.now();
        const response = ollama.pull({  model: `LegacyPaul0809/${modelName}`, stream: true    });
        // for await (const progress of response) {
        //     console.log("Pull progress:", progress);
        // }
        const duration = (Date.now() - startTime) / 1000
        console.log("Time taken (in seconds) - ", duration);

        // console.log(ollamaResponse);

        return NextResponse.json({ message: `Pulled the model successfully.` }, { status: 200 });
    } catch (error: any) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
