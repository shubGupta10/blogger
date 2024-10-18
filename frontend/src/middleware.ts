import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userAuth = request.cookies.get('userAuth')?.value === 'true';
    const path = request.nextUrl.pathname;

    const publicPages = ['/', '/Auth/login', '/Auth/signUp'];

    // If there's no token, check userAuth
    if (!token) {
        if (!publicPages.includes(path) && !userAuth) {
            return NextResponse.redirect(new URL('/Auth/login', request.url));
        }
    } else {
        // If the user is authenticated and tries to access public pages, redirect to Dashboard
        if (path === '/Auth/login' || path === '/Auth/signUp') {
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
