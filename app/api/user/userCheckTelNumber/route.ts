import { NextResponse } from "next/server";
import { getUserCheckTelNumber } from "../userTable";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const telNumber = url.searchParams.get("telNumber");

    if(typeof telNumber === "string") {
        const data = await getUserCheckTelNumber(telNumber);
        return NextResponse.json(data);
    } else {
        return NextResponse.json({message: "전화번호를 입력하세요."}, {status: 400});
    }

}