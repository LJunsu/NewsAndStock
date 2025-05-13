import { NextResponse } from "next/server";
import { insertComment, thisNewsComment } from "../newsTable";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
    const body = await req.json();
    const {newsId, email, comment} = body;

    try {
        if(!newsId || !comment || typeof comment !== "string") {
            return NextResponse.json({message: "Invalid body"}, {status: 400});
        }
    
        const insertResult = await insertComment(newsId, email, comment) as ResultSetHeader;
        
        if(insertResult.affectedRows > 0) {
            // 방금 추가한 댓글의 정보 반환
            const newsCommentId = insertResult.insertId;
            const result = await thisNewsComment(newsCommentId) as ResultSetHeader;

            return NextResponse.json({ok: true, nowInsertComment: result});
        }
        else return NextResponse.json({message: "댓글 등록에 실패했습니다. 다시 시도해주세요."}, {status: 400});
    } catch(err) {
        console.error(err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}