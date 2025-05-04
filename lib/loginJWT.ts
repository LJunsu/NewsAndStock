"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function loginJwt(email: string) {
    if(!process.env.AUTH_SECRET) return { success: false };

    const token = jwt.sign(
        {email: email}, process.env.AUTH_SECRET, {expiresIn: "1h"}
    );

    const cookiesStore = await cookies();

    cookiesStore.set("JWT_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
    });

    return { success: true };
}