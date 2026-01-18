import { NextResponse } from 'next/server';
import { MOCK_ROOMS } from '@/services/mockData';

export async function GET() {
  return NextResponse.json(MOCK_ROOMS);
}
