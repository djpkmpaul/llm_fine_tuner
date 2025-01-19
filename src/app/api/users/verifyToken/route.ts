import { NextRequest, NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";

connect();
export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        const decodedToken: any = jwt.verify(token, process.env.USER_SESSION_SECRET!);

        const userId = decodedToken.id;
        const foundUser = await User.findById(userId);
        console.log(userId);
        console.log(foundUser);

        // 1. Query the userId
        if (!foundUser) {
            return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
        }
        // 2. Check if the user is already verified 
        if (foundUser.isVerified) {
            return NextResponse.json({ message: "You are already verified user", success: true }, { status: 200 });
        }
        // 3. Check for Token consistency
        if (foundUser.verifyToken !== token) {
            return NextResponse.json({ error: "Token mismatch, request for a new token", success: false }, { status: 404 });
        }
        // 4. Check for Token Expiry time
        if (foundUser.verifyTokenExpiry < Date.now()) {
            return NextResponse.json({ error: "Token has expired, request for a new token", success: false }, { status: 404 });
        }

        // 4. When Token is valid -> set isVerified as True 
        foundUser.isVerified = true;
        foundUser.verifyToken = undefined;
        foundUser.verifyTokenExpiry = undefined;
        await foundUser.save();
        return NextResponse.json({ message: "Verified successfully", success: true }, { status: 200 });

    } catch (error: any) {
        if (error instanceof JsonWebTokenError) {
            return NextResponse.json({ error: "Try Again with different token.\nError occurred while decoding the token!", success: false }, { status: 400 });
        }
        console.log(error);
        console.log(error.message);
        console.log("Error occurred");
        return NextResponse.json({ error: "Error occurred!", success: false }, { status: 500 });
    }

}