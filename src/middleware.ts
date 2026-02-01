import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyRefresh } from '@/lib/jwt';

// 定义受保护的路由路径
const protectedRoutes = ['/dashboard'];
// 定义认证路由（已登录用户不应访问）
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 判断当前请求是否涉及受保护路由或认证路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  // 如果既不是受保护路由也不是认证路由，直接放行
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // 2. 获取 Refresh Token (存储在 HttpOnly Cookie 中)
  const refreshToken = request.cookies.get('starstudy_refresh')?.value;

  let isAuthenticated = false;

  if (refreshToken) {
    try {
      // 验证 Token 是否有效
      // 注意：这里我们只验证 Refresh Token，因为 Access Token 存储在内存中，Middleware 无法获取
      // 只要 Refresh Token 有效，客户端就可以通过静默刷新获取 Access Token
      await verifyRefresh(refreshToken);
      isAuthenticated = true;
    } catch (error) {
      // Token 无效或过期
      isAuthenticated = false;
    }
  }

  // 3. 路由守卫逻辑
  
  // 情况 A: 未登录用户尝试访问受保护页面 -> 重定向到登录页
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // 记录用户原本想访问的页面，以便登录后跳转回来
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 情况 B: 已登录用户尝试访问登录/注册页 -> 重定向到仪表盘
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 其他情况放行
  return NextResponse.next();
}

export const config = {
  // 仅匹配需要处理的路由，避免不必要的性能开销
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
};
