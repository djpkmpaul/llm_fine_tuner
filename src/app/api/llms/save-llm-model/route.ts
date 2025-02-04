import { NextRequest, NextResponse } from "next/server";
import Llm from "@/models/llmModel";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
    try {
        console.log("AWS Fine-Tuned your model. Now saving that in MongoDB");

        let createLLMData = await request.json();
        console.log(createLLMData);
        console.log("session details - ",createLLMData.userSessionDetails);
        console.log("username - ",createLLMData.userSessionDetails.username);

        const newModel = new Llm({
            name: createLLMData.llmName,
            baseModel: createLLMData.baseModel,
            modelParams: createLLMData.modelParams, 
        });
        
        const username = createLLMData.userSessionDetails.username;
        const foundUser = await User.findOne({ username });

        if (!foundUser) {
            return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
        }

        if (foundUser.llms.length >= 4) {
            console.log("User already has 4 LLMs:", foundUser.llms);
            return NextResponse.json({ error: "User cannot have more than 4 LLMs", success: false }, { status: 429 });
        }

        // Save the LLM to MongoDB
        const savedModel = await newModel.save();
        foundUser.llms.push(savedModel._id);
        await foundUser.save();

        console.log("Created new LLM:", savedModel);

        return NextResponse.json({ message: "Created LLM Successfully", success: true, savedModel }, { status: 200 });
    } catch (error: any) {
        console.log("Error occurred - ", error);
        return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }
}
