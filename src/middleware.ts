import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Login Part
export function middleware(request: NextRequest) {

    //? nextUrl means the domain name "http://localhost" 
    const path = request.nextUrl.pathname;
    if(path === "/" || path === "/verify"){
        // whether or not TOKEN exist allow everyone to view homepage or verify page
        return 
    }
    
    //* should not be visible to someone who has LOGGED-IN
    const isPublicPath = (path === "/register" || path === "/login");
    
    const token = request.cookies.get("userSession")?.value || "";
    
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && !token) {
        // Protected path and no token -----then-> login
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

// Matching Part
export const config = {
    matcher: [
        '/',
        '/chat/:token*',
        '/createllm',
        '/dashboard',
        '/login',
        '/llm/:username*',
        '/profile',
        '/register',
        '/signup',
        '/verify',
    ]
}

