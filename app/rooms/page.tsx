import { Suspense } from 'react';
import RoomsPageClient from '@/components/RoomsPageClient';

export const revalidate = 60;

async function getBaseUrl() {
  const envBase =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return envBase ?? 'http://localhost:3000';
}

async function getRooms() {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/rooms`, {
    next: { revalidate: 60, tags: ['rooms'] },
  });
  return res.json();
}

function SkeletonGrid() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-48 md:h-80 bg-gray-200 rounded-xl md:rounded-2xl animate-pulse"></div>
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
