import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userAuth = request.cookies.get('userAuth')?.value === 'true';
    const path = request.nextUrl.pathname;

    const publicPages = ['/', '/Auth/login', '/Auth/signUp'];

    if (!token) {
        if (!publicPages.includes(path) && !userAuth) {
            return NextResponse.redirect(new URL('/Auth/login', request.url));
        }
    } else {
        if (publicPages.includes(path)) {
            return NextResponse.redirect(new URL('/pages/Dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/Auth/login',
        '/Auth/signUp',
        '/pages/*' 
    ],
};
