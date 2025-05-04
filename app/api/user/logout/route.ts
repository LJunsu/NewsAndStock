import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({message: "Logged out"});
    
    response.cookies.set("JWT_token", "", {maxAge: 0, httpOnly: true, path: "/"});

    return response;
}