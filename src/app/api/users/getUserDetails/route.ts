import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server";

connect();
export async function GET(req: NextRequest) {
    try {
        const myUsers = await User.find();
        return NextResponse.json({user: myUsers, success: 200} )   
    } catch (error: any) {
        NextResponse.json({error: `${error.message}\nError Occurred`}, {status: 500});
    }
}