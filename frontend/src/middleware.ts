import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;  // Retrieve token from cookies
  const path = request.nextUrl.pathname;

  // Define the routes that are public
  const publicRoutes = ['/', '/Auth/login', '/Auth/signUp'];

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.includes(path);

  // If token exists (user is authenticated), allow access to any route
  if (token) {
    return NextResponse.next();  // Let them access any route
  }

  if (isPublicRoute) {
    return NextResponse.next();  
  }

  // If not authenticated and trying to access a protected route, redirect to login
  return NextResponse.redirect(new URL('/Auth/login', request.url));
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
