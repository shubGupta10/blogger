import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const path = request.nextUrl.pathname;

  const publicRoutes = ['/', '/Auth/login', '/Auth/signUp'];
  const publicPartialRoutes = ['/pages/blogs/', '/pages/publicBlogs'];

  const isPublicRoute =
    publicRoutes.includes(path) ||
    publicPartialRoutes.some(route => path.startsWith(route));

  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    if (publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/pages/Dashboard', request.url));
    }
    return NextResponse.next();
  } else {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/Auth/login', request.url));
  }
}