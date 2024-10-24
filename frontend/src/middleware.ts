import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log("Middleware - Cookie Token:", token);
  
  const authHeader = request.headers.get('authorization');
  const headtoken = authHeader ? authHeader.split(' ')[1] : null;
  console.log("Middleware - Authorization Token:", headtoken);
    
  const path = request.nextUrl.pathname;

  const publicRoutes = ['/', '/Auth/login', '/Auth/signUp', '/pages/publicBlogs', '/pages/viewBlog/:id'];

  const isPublicRoute = publicRoutes.includes(path);

  if ((token || headtoken) && (path === '/Auth/login' || path === '/Auth/signUp')) {
    return NextResponse.redirect(new URL('/pages/Dashboard', request.url));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token && !headtoken) {
    return NextResponse.redirect(new URL('/Auth/login', request.url));
  }

  return NextResponse.next();  
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
