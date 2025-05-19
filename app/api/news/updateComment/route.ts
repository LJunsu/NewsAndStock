import { NextResponse } from "next/server";
import { thisNewsComment, updateComment } from "../newsTable";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
    const body = await req.json();
    const {newsId, commentId, email, comment} = body;

    try {
        if(!newsId || !commentId || !comment || typeof comment !== "string") {
            return NextResponse.json({message: "Invalid body"}, {status: 400});
        }
    
        const updateResult = await updateComment(newsId, commentId, email, comment) as ResultSetHeader;
        
        if(updateResult.affectedRows > 0) {
            // 방금 추가한 댓글의 정보 반환
            const result = await thisNewsComment(commentId) as ResultSetHeader;

            return NextResponse.json({ok: true, nowUpdateComment: result});
        }
        else return NextResponse.json({message: "댓글 등록에 실패했습니다. 다시 시도해주세요."}, {status: 400});
    } catch(err) {
        console.error(err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}