import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the Authorization header
  const authHeader = request.headers.get('Authorization');
  const path = request.nextUrl.pathname;

  const publicRoutes = ['/', '/Auth/login', '/Auth/signUp'];
  const publicPartialRoutes = ['/pages/blogs/:id', '/pages/publicBlogs'];

  const isPublicRoute =
    publicRoutes.includes(path) ||
    publicPartialRoutes.some(route => path.startsWith(route));

  // Check if the Authorization header contains a Bearer token
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    // If the user is authenticated
    if (publicRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/pages/Dashboard', request.url));
    }
    return NextResponse.next(); // Allow access to other routes
  } else {
    // If the user is not authenticated
    if (isPublicRoute) {
      return NextResponse.next(); // Allow access to public routes
    }
    return NextResponse.redirect(new URL('/Auth/login', request.url)); // Redirect to login for protected routes
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
