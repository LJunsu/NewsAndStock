import { NextResponse } from "next/server";
import { insertComment } from "../newsTable";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
    const body = await req.json();
    const {newsId, email, comment} = body;

    try {
        if(!newsId || !comment || typeof comment !== "string") {
            return NextResponse.json({message: "Invalid body"}, {status: 400});
        }
    
        const result = await insertComment(newsId, email, comment) as ResultSetHeader;

        if(result.affectedRows > 0) return NextResponse.json({ok: true});
        else return NextResponse.json({message: "댓글 등록에 실패했습니다. 다시 시도해주세요."}, {status: 400});
    } catch(err) {
        console.error(err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}