import { getUserCheckEmail } from "../userTable";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await getUserCheckEmail();

    return NextResponse.json(data);
}