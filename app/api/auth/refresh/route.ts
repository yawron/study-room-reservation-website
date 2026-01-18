import { NextResponse } from 'next/server';

function createAccessToken(userId: string) {
  return `jwt_${Date.now()}_${userId}`;
}

function createRefreshToken(userId: string) {
  return `rt_${Date.now()}_${userId}`;
}

function parseRefresh(refresh: string | undefined) {
  if (!refresh || !refresh.startsWith('rt_')) return null;
  const parts = refresh.split('_');
  if (parts.length < 3) return null;
  const ts = Number(parts[1]);
  const userId = parts.slice(2).join('_');
  if (!Number.isFinite(ts) || !userId) return null;
  const sevenDays = 60 * 60 * 24 * 7 * 1000;
  if (Date.now() - ts > sevenDays) return null;
  return { userId };
}

export async function POST() {
  const refresh = (await import('next/headers')).cookies().get('starstudy_refresh')?.value;
  const parsed = parseRefresh(refresh);
  if (!parsed) {
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
  const access = createAccessToken(parsed.userId);
  const nextRefresh = createRefreshToken(parsed.userId);
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
