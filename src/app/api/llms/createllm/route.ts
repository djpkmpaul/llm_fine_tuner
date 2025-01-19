import { NextRequest, NextResponse } from "next/server"
import { connect } from "@/dbconfig/dbconfig"
import Llm from "@/models/llmModel";
import User from "@/models/userModel";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const createLLMData = await request.json();
        console.log(createLLMData);
        const newModel = new Llm({
            name: createLLMData.llmName,
            baseModel: createLLMData.baseModel,
            modelParams: createLLMData.modelParams
        })
        const savedModel = await newModel.save();
        const { username, email } = createLLMData.userSessionDetails
        const foundUser = await User.findOne({ username })
        if (foundUser.llms.length >= 4) {
            console.log("your llms - ", foundUser.llms);
            return NextResponse.json({ error: "User cannot have more than 4 LLMs ", success: false }, { status: 429 })
        }

        console.log("type - ", typeof (foundUser.llms))
        foundUser.llms.push(savedModel._id);
        const savedUser = await foundUser.save();

        // foundUser.llms = [...foundUser.llms, (savedModel._id)];
        console.log(savedModel);
        console.log(savedUser);
        return NextResponse.json({ message: "Created LLM Successfully ", success: true, savedModel }, { status: 200 })
    } catch (error: any) {
        console.log(error);
        console.log(error.response.data);
        return NextResponse.json({ error: "Error occurred " + error.message, success: false }, { status: 500 })
    }
}