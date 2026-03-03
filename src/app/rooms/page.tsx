import RoomsPageClient from '@/components/RoomsPageClient';
import { MOCK_ROOMS } from '@/services/mockData';

export const revalidate = 60;

async function getBaseUrl() {
  const envBase =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return envBase ?? 'http://localhost:3000';
}

async function getRooms() {
  const base = await getBaseUrl();
  try {
    const res = await fetch(`${base}/api/rooms`, {
      next: { revalidate: 60, tags: ['rooms'] },
    });
    if (!res.ok) {
      return MOCK_ROOMS;
    }
    const payload = await res.json();
    const data = Array.isArray(payload) ? payload : payload?.data;
    if (!Array.isArray(data)) return MOCK_ROOMS;
    return data;
  } catch {
    return MOCK_ROOMS;
  }
}

export default async function RoomsPage() {
  const rooms = await getRooms();
  return <RoomsPageClient initialRooms={rooms} />;
}
