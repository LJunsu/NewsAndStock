import { NextResponse } from "next/server";
import { newsCheckId } from "../newsTable";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    try {
        if(!id) return;

        const check = await newsCheckId(id);

        return NextResponse.json(check);
    } catch(err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}