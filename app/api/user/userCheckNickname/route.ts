import { NextResponse } from "next/server";
import { getUserCheckNickname } from "../userTable";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const nickname = url.searchParams.get("nickname");

    if(typeof nickname === "string") {
        const data = await getUserCheckNickname(nickname);
        return NextResponse.json(data);
    } else {
        return NextResponse.json({message: "닉네임을 입력하세요."}, {status: 400});
    }
}