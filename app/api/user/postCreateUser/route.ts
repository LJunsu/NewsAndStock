import { NextApiResponse } from "next";
import { postCreateUser } from "../userTable";
import { NextResponse } from "next/server";
import { CreateUserType } from "@/lib/CreateUserType";

export async function POST(req: Request, res: NextApiResponse) {
    if(req.method !== "POST") {
        return res.status(405).json({message: "Method Not Allowed"});
    }

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