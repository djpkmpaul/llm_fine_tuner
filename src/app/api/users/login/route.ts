import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return NextResponse.json({ error: "User not found!", success: false }, { status: 404 });
        }

        const comparedPassword = await bcryptjs.compare(password, foundUser.password);
        if (!comparedPassword) {
            return NextResponse.json({ error: "Password is incorrect!", success: false }, { status: 400 });
        }
        console.log(foundUser);
        if(!foundUser.isVerified){
            console.log(`Redirecting to ${process.env.DOMAIN}/verify`);
            return NextResponse.json({ error: "Email not verified", success: false, redirect: '/verify', foundUser }, { status: 300 });
        }
        // Create a session token 
        const userSessionData = {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email
        }

        const userSessionToken = jwt.sign(userSessionData, process.env.USER_SESSION_SECRET!,
            {
                expiresIn: "1d"
            }
        );
        const response = NextResponse.json({
            message: "Successfully logged in",
            success: true,
        },
            { status: 200 }
        );
        
        response.cookies.set("userSession", userSessionToken, {
            httpOnly: true, // which means it can'y be accessed using JS
            path: '/' // acessible across all routes
        })
        return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}