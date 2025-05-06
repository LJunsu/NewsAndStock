import { NextResponse } from "next/server";
import { newsLikeCheck, newsLikeDelete, newsLikeInsert } from "../newsTable";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
    
    try {
        const body = await req.json();
        const {id, email} = body;

        if(!id || !email) return NextResponse.json({ message: "Invalid body" }, { status: 400 });

        const like = await newsLikeCheck(id, email) as RowDataPacket[];

        if(like.length > 0) {
            await newsLikeDelete(id, email);
            return NextResponse.json({ message: "like Delete", likeOn: false });
        }
        else {
            await newsLikeInsert(id, email);
            return NextResponse.json({ message: "like Insert", likeOn: true });
        }
    } catch(err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}