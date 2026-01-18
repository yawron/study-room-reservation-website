import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ code: 200, data: { success: true }, message: '已退出' }, { status: 200 });
  res.cookies.set('starstudy_refresh', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}

