// /pages/api/sendVerificationEmail.js
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig"
import jwt from "jsonwebtoken"
const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_SMTP,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.MAILTRAP_PASSWORD
    },
});

connect();
export async function POST(request: NextRequest) {
    // find the user with the email and send verification email
    if (request.method.toUpperCase() == "POST") {
        const { email } = await request.json();
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return NextResponse.json({ error: "User not found", success: false }, { status: 404 });
        }
        console.log(foundUser.isVerified);
        console.log("foundUser.isVerified");
        if(foundUser.isVerified){
            return NextResponse.json({ message: "User is already verified", success: true }, { status: 200 });
        }
        const signedToken = await jwt.sign({id: foundUser._id}, process.env.USER_SESSION_SECRET!);

        const url = `${process.env.DOMAIN}/verify?q=${signedToken}`

        console.log(`sending email to ${email}`);
        console.log(`url = ${url}`);

        try {
            const info = await transporter.sendMail({
                from: process.env.GMAIL_USER, // sender address
                to: email, // list of receivers
                subject: "Please verify your email", // Subject line
                text: `Please click the link to verify your email address.\n${url}`, // plain text body
                html: `<a href="${url}">Copy paste: ${url}</a>`
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Email sent to ", email);

            // After sending email, store the same token in DB with expiry time 1 hr from now
            foundUser.verifyToken = signedToken;
            foundUser.verifyTokenExpiry = Date.now() + 3600 * 1000; // 1 hr from sending email
            const savedUser = await foundUser.save();
            console.log("Email send saved user: ", savedUser);
            return NextResponse.json({ message: `Verification email sent\nPlease visit the link sent to your email ${email}`, success: true }, { status: 200 });
        } catch (error) {
            console.error("Error sending email:", error);
            return NextResponse.json({ error: 'Failed to send verification email', success: false }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Only POST Method allowed', success: false }, { status: 405 });
    }

}
