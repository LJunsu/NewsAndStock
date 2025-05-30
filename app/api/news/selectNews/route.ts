import { NextResponse } from "next/server";
import { insertNewsId, newsCheckId } from "../newsTable";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if(!id) return NextResponse.json({ message: "Missing 'id' query parameter" }, { status: 400 });

    try {
        const exists  = await newsCheckId(id) as RowDataPacket[];

        if(exists.length > 0) return NextResponse.json({ message: "exists" });

        await insertNewsId(id);
        return NextResponse.json({ message: "inserted" });
    } catch(err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}