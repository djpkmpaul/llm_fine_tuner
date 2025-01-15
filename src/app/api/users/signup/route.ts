import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbconfig";
import mongoose from "mongoose";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

// Connect to the database 
connect();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        
        const foundEmail = await User.findOne({email});
        console.log("Found Email: ", foundEmail);
        if(foundEmail){
            return NextResponse.json({
                error: "Email already registered. User exists.",
                success: false
            }, {status: 400});
        }
        const foundUsername = await User.findOne({username});
        if(foundUsername){
            return NextResponse.json({
                error: "Username already exists.",
                success: false
            }, {status: 400});
        }
        console.log("Found no user with this email and password");
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        const newUser = new User({username, email, password: hashedPassword});     
        const savedUser = await newUser.save();

        console.log("saved user - ", newUser);
        
        return NextResponse.json({
            message: "User created successfully",
            success: true, 
            savedUser
        }, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: error.message, success: false}, {status: 500});
    }
}