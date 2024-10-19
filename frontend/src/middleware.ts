import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    console.log('Middleware started');
    console.log('Full URL:', request.url);
    console.log('Path:', request.nextUrl.pathname);
}

export const config = {
    matcher: [],
};