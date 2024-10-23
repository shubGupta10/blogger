import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log("Middleware - Cookie Token:", token);
  
  const authHeader = request.headers['authorization']; // Use lowercase 'authorization'
  const headtoken = authHeader ? authHeader.split(' ')[1] : null;
  console.log("Middleware - Authorization Token:", headtoken);
    
  const path = request.nextUrl.pathname;

  const publicRoutes = ['/', '/Auth/login', '/Auth/signUp', '/pages/publicBlogs', '/pages/viewBlog/:id'];

  const isPublicRoute = publicRoutes.includes(path);

  if (token || headtoken) {
    return NextResponse.next();  
  }

  if (isPublicRoute) {
    return NextResponse.next();  
  }

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
