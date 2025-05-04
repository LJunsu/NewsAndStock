import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { match } from "path-to-regexp";

const matchersForAuth = [
    "/stock"
];

const matchersForNoAuth = [
    "/create-account",
    "/login"
];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("JWT_token")?.value;
    const secretKey = process.env.AUTH_SECRET;
    let session = null;

    if(token) {
        if(!secretKey) {
            console.error("No AUTH_SECRET");
            return NextResponse.redirect(new URL("/login", req.url))
        }

        try {
            const {payload} = await jwtVerify(token, new TextEncoder().encode(secretKey));
            session = payload;
        } catch (err) {
            console.error(err);
            session = null;
        }
    }

    if(isMatch(req.nextUrl.pathname, matchersForAuth) && !session) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    if(isMatch(req.nextUrl.pathname, matchersForNoAuth) && session) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("user-email", (session?.email || "") as string);

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}

function isMatch(pathname: string, urls: string[]) {
    return urls.some(url => !!match(url)(pathname));
}