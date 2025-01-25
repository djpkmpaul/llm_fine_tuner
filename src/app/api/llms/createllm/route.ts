import { NextRequest, NextResponse } from "next/server"
import { connect } from "@/dbconfig/dbconfig"
import path from "path";
import fs from "fs"
import Llm from "@/models/llmModel";
import User from "@/models/userModel";
import axios from "axios";

connect();
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");
export async function POST(request: NextRequest) {
    try {
        // const createLLMData = await request.json();
        const formData = await request.formData();
        const body = Object.fromEntries(formData.entries());
        const inputColType: string[] = body.inputColType.toString().split(',')
        const inputColValue: string[] = body.inputColValue.toString().split(',')
        
        // My Params 
        const file = formData.get("file") as File
        

        // Some Weird conversion
        const modelParams = JSON.parse(JSON.parse(JSON.stringify(body.modelParams)))
        const trainingArguments = JSON.parse(JSON.parse(JSON.stringify(body.trainingArguments)))
        const userSessionDetails = JSON.parse(JSON.parse(JSON.stringify(body.userSessionDetails)))
        const createLLMData = {
            ...body,
            llmName: body.llmName,
            baseModel: body.baseModel,
            modelParams: modelParams,
            trainingArguments: trainingArguments,
            userSessionDetails: userSessionDetails
        }
        console.log(createLLMData, " createLLMData");

        // Ensure the directory exists
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }



        const newModel = new Llm({
            name: createLLMData.llmName,
            baseModel: createLLMData.baseModel,
            modelParams: createLLMData.modelParams
        })

        const { username, email } = createLLMData.userSessionDetails
        const foundUser = await User.findOne({ username })
        if (foundUser.llms.length >= 4) {
            console.log("your llms - ", foundUser.llms);
            return NextResponse.json({ error: "User cannot have more than 4 LLMs ", success: false }, { status: 429 })
        }
        
        // save the dataset file to the public/dataset folder if user has less than 4 LLMs
        const filePath = path.join(UPLOAD_DIR, file.name);
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, fileBuffer);
        console.log("File wrote to - ", filePath);

        // save the model if the user hasnt already owns 4 LLMs
        const savedModel = await newModel.save();
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

