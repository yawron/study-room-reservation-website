import { NextResponse } from 'next/server';
import { verifyAccess } from '@/lib/jwt';
import { INITIAL_USER } from '@/services/mockData';

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ code: 401, data: null, message: '未授权' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyAccess(token);
    const userId = payload.sub as string;

    // 模拟数据库查询
    // 在真实场景中，这里应该根据 userId 查询数据库
    const user = {
      ...INITIAL_USER,
      id: userId,
      // 如果不是 u1，可以动态生成一些信息，或者直接返回 INITIAL_USER 用于演示
      name: userId === 'u1' ? INITIAL_USER.name : `User ${userId}`,
      email: userId === 'u1' ? INITIAL_USER.email : `${userId}@example.com`,
    };

    return NextResponse.json({ code: 200, data: user, message: '获取成功' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ code: 401, data: null, message: '令牌无效或已过期' }, { status: 401 });
  }
}
