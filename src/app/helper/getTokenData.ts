import { NextRequest } from "next/server"

export default async function getUserToken(request: NextRequest){
    try {
        const encodedUser = request.cookies.get("userSession")?.value || ""
        console.log(encodedUser);
    } catch (error : any) {
        console.log(error.message);
    }
}