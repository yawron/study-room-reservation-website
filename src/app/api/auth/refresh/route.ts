import { NextResponse } from 'next/server';
import { signAccessToken, signRefreshToken, verifyRefresh, REFRESH_COOKIE_CONFIG } from '@/lib/jwt';

export async function POST() {
  const refresh = (await import('next/headers')).cookies().get(REFRESH_COOKIE_CONFIG.name)?.value;
  let userId: string | null = null;
  try {
    const payload = refresh ? await verifyRefresh(refresh) : null;
    userId = typeof payload?.sub === 'string' ? payload.sub : null;
  } catch {
    userId = null;
  }
  if (!userId) {
    const res = NextResponse.json({ code: 401, data: null, message: '刷新令牌无效或过期' }, { status: 401 });
    res.cookies.set(REFRESH_COOKIE_CONFIG.name, '', {
      ...REFRESH_COOKIE_CONFIG.options,
      maxAge: 0,
    });
    return res;
  }
  const access = await signAccessToken(userId);
  const nextRefresh = await signRefreshToken(userId);
  const res = NextResponse.json({ code: 200, data: { token: access }, message: '刷新成功' }, { status: 200 });
  res.cookies.set(REFRESH_COOKIE_CONFIG.name, nextRefresh, REFRESH_COOKIE_CONFIG.options);
  return res;
}
