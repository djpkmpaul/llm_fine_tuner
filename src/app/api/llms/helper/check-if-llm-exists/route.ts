import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Llm from "@/models/llmModel";

connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existingLLM = await Llm.findOne({ name });

    return NextResponse.json({ exists: !!existingLLM });
  } catch (error: any) {
    console.error("Error checking LLM name:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
