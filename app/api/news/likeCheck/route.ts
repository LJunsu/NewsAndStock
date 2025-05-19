import { NextResponse } from "next/server";
import { newsLikeCheck } from "../newsTable";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
    
    try {
        const body = await req.json();
        const {id, email} = body;

        if(!id || !email) return NextResponse.json({ ok: false, message: "Invalid body" }, { status: 400 });

        const like = await newsLikeCheck(id, email) as RowDataPacket[];

        if(like.length > 0) {
            // await newsLikeDelete(id, email);
            return NextResponse.json({ok: true, likeOn: true});
        }
        else {
            // await newsLikeInsert(id, email);
            return NextResponse.json({ok: true, likeOn: false});
        }
    } catch(err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
    }
}