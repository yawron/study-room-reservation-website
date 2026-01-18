import { NextResponse } from 'next/server';

function createAccessToken(userId: string) {
  return `jwt_${Date.now()}_${userId}`;
}

function createRefreshToken(userId: string) {
  return `rt_${Date.now()}_${userId}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = body?.name as string | undefined;
  const email = body?.email as string | undefined;
  if (!name || !email) {
    return NextResponse.json({ code: 400, data: null, message: '缺少注册信息' }, { status: 400 });
  }

  const user = {
    id: 'u_' + Math.random().toString(36).slice(2, 9),
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  };
  const access = createAccessToken(user.id);
  const refresh = createRefreshToken(user.id);

  const res = NextResponse.json(
    { code: 200, data: { user, token: access }, message: '注册成功' },
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
