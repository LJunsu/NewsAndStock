import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";
import { deleteComment } from "../newsTable";

export async function DELETE(req: Request) {
    const body = await req.json();
    const {newsId, commentId} = body;

    try {
        if(!newsId || !commentId) {
            return NextResponse.json({message: "Invalid body"}, {status: 400});
        }
    
        const result = await deleteComment(newsId, commentId) as ResultSetHeader;

        if(result.affectedRows > 0) return NextResponse.json({ok: true});
        else return NextResponse.json({message: "댓글 삭제에 실패했습니다. 다시 시도해주세요."}, {status: 400});
    } catch(err) {
        console.error(err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}