import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import { newsLikeDelete } from "../newsTable";

export async function POST(req: Request) {
    
    try {
        const body = await req.json();
        const {id, email} = body;

        if(!id || !email) return NextResponse.json({ ok: false, message: "Invalid body" }, { status: 400 });

        const result = await newsLikeDelete(id, email) as ResultSetHeader;
        if(result.affectedRows > 0) {
            return NextResponse.json({ok: true, likeOn: false});
        }

        return NextResponse.json({ok: false, likeOn: true});
    } catch(err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
    }
}