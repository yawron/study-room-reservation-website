import { NextResponse } from 'next/server';
import { INITIAL_USER } from '@/services/mockData';

function createAccessToken(userId: string) {
  return `jwt_${Date.now()}_${userId}`;
}

function createRefreshToken(userId: string) {
  return `rt_${Date.now()}_${userId}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = body?.email as string | undefined;
  if (!email) {
    return NextResponse.json({ code: 400, data: null, message: '缺少邮箱' }, { status: 400 });
  }

  const user =
    email === INITIAL_USER.email
      ? INITIAL_USER
      : {
          id: 'u_' + Math.random().toString(36).slice(2, 9),
          name: email.split('@')[0],
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email.split('@')[0])}`,
        };

  const access = createAccessToken(user.id);
  const refresh = createRefreshToken(user.id);

  const res = NextResponse.json(
    { code: 200, data: { user, token: access }, message: '登录成功' },
    { status: 200 }
  );
  res.cookies.set('starstudy_refresh', refresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
