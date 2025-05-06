import { NextResponse } from "next/server";
import { newsLikeLength } from "../newsTable";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if(!id) return NextResponse.json({ message: "Missing 'id' query parameter" }, { status: 400 });

    try {
        const newsLikeCount = await newsLikeLength(id) as RowDataPacket[];

        return NextResponse.json(newsLikeCount);
    } catch(err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}