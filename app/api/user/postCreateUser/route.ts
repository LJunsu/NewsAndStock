import { postCreateUser } from "../userTable";
import { NextRequest, NextResponse } from "next/server";
import { CreateUserType } from "@/lib/CreateUserType";

export async function POST(req: NextRequest) {
    try {
        const {email, password, nickname, telNumber, profileImage} = await req.json();
        const userData: CreateUserType = {email, password, nickname, telNumber, profileImage};

        await postCreateUser(userData);
        
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch(err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}