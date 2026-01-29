import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { MOCK_ROOMS } = await import('../../../services/mockData');
    return NextResponse.json(
      { code: 200, data: MOCK_ROOMS, message: '获取成功' },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { code: 500, data: null, message: '房间数据加载失败' },
      { status: 500 }
    );
  }
}
