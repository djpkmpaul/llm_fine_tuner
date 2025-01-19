import { NextRequest, NextResponse } from "next/server";
import Llm from "@/models/llmModel";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig"


connect();
export async function POST(request: NextRequest) {
    try {
        // Parse the request body to get the username
        const { username } = await request.json();
        console.log("Username:", username);

        // Find the user and populate the llms field
        const foundUser = await User.findOne({ username }).populate('llms');
        if (!foundUser) {
            return NextResponse.json(
                { error: "User not found", success: false },
                { status: 404 }
            );
        }

        // Return the found user with populated llms
        console.log(foundUser);
        return NextResponse.json(
            { message: "Successfully fetched all LLMs", success: true, foundUser },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error occurred:", error);
        return NextResponse.json(
            { error: "Error occurred while fetching LLMs", success: false },
            { status: 500 }
        );
    }
}
