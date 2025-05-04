import { NextResponse } from "next/server";
import { getUser } from "../userTable";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if(typeof email === "string") {
        const data = await getUser(email);
        return NextResponse.json(data);
    } else {
        return NextResponse.json({message: "이메일을 입력하세요."}, {status: 400});
    }
}