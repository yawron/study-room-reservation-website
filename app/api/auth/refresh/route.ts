import { NextResponse } from 'next/server';
import { signAccessToken, signRefreshToken, verifyRefresh } from '@/lib/jwt';

export async function POST() {
  const refresh = (await import('next/headers')).cookies().get('starstudy_refresh')?.value;
  let userId: string | null = null;
  try {
    const payload = refresh ? await verifyRefresh(refresh) : null;
    userId = typeof payload?.sub === 'string' ? payload.sub : null;
  } catch {
    userId = null;
  }
  if (!userId) {
    const res = NextResponse.json({ code: 401, data: null, message: '刷新令牌无效或过期' }, { status: 401 });
    res.cookies.set('starstudy_refresh', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
    return res;
  }
  const access = await signAccessToken(userId);
  const nextRefresh = await signRefreshToken(userId);
  const res = NextResponse.json({ code: 200, data: { token: access }, message: '刷新成功' }, { status: 200 });
  res.cookies.set('starstudy_refresh', nextRefresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
