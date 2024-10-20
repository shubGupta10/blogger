import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  const publicRoutes = ['/', '/Auth/login', '/Auth/signUp'];
  const publicPartialRoutes = ['/pages/blogs/:id', '/pages/publicBlogs'];

  const isPublicRoute = publicRoutes.includes(path) || 
    publicPartialRoutes.some(route => path.startsWith(route));

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

export const config = {
  matcher: [
    '/',
    '/Auth/login',
    '/Auth/signUp',
    '/pages/Dashboard',
    '/pages/blogs/:id',
    '/pages/ComingSoon',
    '/pages/createBlog',
    '/pages/EditBlogs/:id',
    '/pages/publicBlogs',
    '/pages/publicUserProfile/:id',
    '/pages/settings',
    '/pages/SummarisePage/:id',
    '/pages/userProfile/:id',
    '/pages/viewBlog/:id'
  ],
};