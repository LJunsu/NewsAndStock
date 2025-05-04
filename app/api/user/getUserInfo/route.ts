import { NextResponse } from "next/server";
import { getUserInfo } from "../userTable";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if(typeof email === "string" && email !== "") {
        const user = await getUserInfo(email);
        return NextResponse.json(user);
    } else {
        return NextResponse.json({message: "해당 이메일의 사용자가 없습니다."}, {status: 400});
    }
}