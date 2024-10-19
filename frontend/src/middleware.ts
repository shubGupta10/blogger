import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    console.log('Middleware started');
    console.log('Full URL:', request.url);
    console.log('Path:', request.nextUrl.pathname);

    let token;
    try {
        token = request.cookies.get('token')?.value;
        console.log('Token from cookie:', token);
    } catch (error) {
        console.error('Error accessing token cookie:', error);
    }

    console.log('All cookies:', request.cookies.getAll());

    const path = request.nextUrl.pathname;
    const publicPages = ['/', '/Auth/login', '/Auth/signUp'];

    console.log('Is public page:', publicPages.includes(path));

    if (!token && !publicPages.includes(path)) {
        console.log('Redirecting to login - No token and not public page');
        return NextResponse.redirect(new URL('/Auth/login', request.url));
    }

    if (token) {
        console.log('Token exists, allowing access');
    } else {
        console.log('No token, but on a public page');
    }

    console.log('Proceeding to next middleware/page');
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/Auth/login',
        '/Auth/signUp',
        '/pages/blogs/:id*', 
        '/pages/createBlog',
        '/pages/Dashboard', 
        '/pages/EditBlogs/:id*', 
        '/pages/settings',
        '/pages/userProfile/:id*' 
    ],
};