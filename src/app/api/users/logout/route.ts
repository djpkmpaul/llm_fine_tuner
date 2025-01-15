import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({
            message: "Successfully logged out",
            success: true
        }, { status: 200 });

        response.cookies.set("userSession", '', {
            httpOnly: true,
            expires: Date.now()
        });

        return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}