import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MOCK_ROOMS } from '@/services/mockData';
import RoomDetailClient from '@/components/RoomDetailClient';
import { Room, Review } from '@/types';

export const revalidate = 60;

// Initial mock reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    roomId: '1',
    userId: 'u99',
    userName: '张同学',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    rating: 5,
    comment: '非常安静，隔音效果很好，效率很高！',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'r2',
    roomId: '1',
    userId: 'u98',
    userName: 'Lee',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lee',
    rating: 4,
    comment: '灯光很舒服，就是空调稍微有点冷。',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

async function getRoomData(id: string) {
  // Simulate network delay for streaming demo
  await new Promise(resolve => setTimeout(resolve, 500));

  const room = MOCK_ROOMS.find(r => r.id === id);

  if (!room) {
    return { room: null, reviews: [] };
  }

  // Return initial reviews (in a real app, this would come from a database)
  const reviews = id === '1' ? INITIAL_REVIEWS : [];

  return { room, reviews };
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="animate-spin h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full"></div>
    </div>
  );
}

async function RoomContent({ id }: { id: string }) {
  const { room, reviews } = await getRoomData(id);

  if (!room) {
    notFound();
  }

  return <RoomDetailClient initialRoom={room} initialReviews={reviews} />;
}

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RoomContent id={id} />
    </Suspense>
  );
}
