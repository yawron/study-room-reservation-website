import { Suspense } from 'react';
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

function SkeletonGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-[400px] bg-white rounded-lg border-2 border-black shadow-neo overflow-hidden flex flex-col">
             <div className="h-56 bg-gray-200 border-b-2 border-black animate-pulse"></div>
             <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse w-full mt-auto"></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function RoomsContent() {
  const rooms = await getRooms();
  return <RoomsPageClient initialRooms={rooms} />;
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <RoomsContent />
    </Suspense>
  );
}
