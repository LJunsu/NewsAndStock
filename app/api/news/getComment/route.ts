import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { newsComments } from "../newsTable";


export async function GET(req: Request) {
    const url = new URL(req.url);
    const newsId = url.searchParams.get("newsId");

    if(!newsId) return NextResponse.json({ message: "Missing 'newsId' query parameter" }, { status: 400 });

    try {
        const comments = await newsComments(newsId) as RowDataPacket[];

        return NextResponse.json(comments);
    } catch(err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}