import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const publicPages = ['/', '/Auth/login', '/Auth/signUp'];

    if (!token) {
        if (!publicPages.includes(pathname)) {
            return NextResponse.redirect(new URL('/Auth/login', request.url));
        }
    } else {
        if (pathname === '/Auth/login' || pathname === '/Auth/signUp') {
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
        '/pages/blogs/:id',
        '/pages/createBlog',
        '/pages/Dashboard',
        '/pages/EditBlogs/:id',
        '/pages/settings',
        '/pages/userProfile/:id'
    ],
};