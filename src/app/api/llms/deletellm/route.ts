import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Llm from "@/models/llmModel";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();  
    console.log("Deleting the LLM and user:", data);

    // Step 1: Find and delete the LLM by tokenId
    const llm = await Llm.findOneAndDelete({ tokenId: data.tokenId });
    if (!llm) {
      return NextResponse.json({ message: "LLM not found", success: false }, { status: 404 });
    }
    console.log("Deleted LLM:", llm);

    // Step 2: Find the user who references this LLM's _id
    const user = await User.findOne({ llms: llm._id });
    if (!user) {
      return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
    }
    console.log("Found user:", user);

    // Step 3: Remove the LLM's _id from the user's llms array
    user.llms = user.llms.filter((llmId: any) => llmId.toString() !== llm._id.toString());
    await user.save();
    console.log("Updated user:", user);
    
    return NextResponse.json({ message: "LLM and user deleted successfully", success: true }, { status: 200 });
  } catch (error: any) {
    console.log("Error occurred:", error.message);
    return NextResponse.json({ message: "Error: " + error.message, success: false }, { status: 500 });
  }
}
