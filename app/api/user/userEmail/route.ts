import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const headerList = await headers();
    const email = headerList.get("user-email");
    return NextResponse.json({ email: email || null });
}