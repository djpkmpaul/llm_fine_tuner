import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse, NextMiddleware } from "next/server";
import jwt from "jsonwebtoken"

connect();

// to get the username and email to display on nav bar
export async function GET(request: NextRequest) {
    try {
                
        const encodedToken = request.cookies.get("userSession")?.value || ""
        if(!encodedToken){
            return NextResponse.json({error: "Empty token", success: false}, {status: 404});
        }
        const decodedToken = jwt.verify(encodedToken, process.env.USER_SESSION_SECRET!)
        console.log(decodedToken);
        return NextResponse.json({decodedToken, success: 200} )   
    } catch (error: any) {
        NextResponse.json({error: `${error.message}\nError Occurred`}, {status: 500});
    }
}