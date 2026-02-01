'use server';

import { cookies } from 'next/headers';
import { Review } from '@/types';
import { getAuthenticatedUser } from '@/lib/server-utils';

export async function submitReviewAction(payload: {
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  // 验证用户身份
  const authUserId = await getAuthenticatedUser();

  const rating = Math.max(1, Math.min(5, Math.floor(payload.rating)));
  const comment = String(payload.comment).slice(0, 1000);

  const review: Review = {
    id: Math.random().toString(36).slice(2, 11),
    roomId: payload.roomId,
    userId: authUserId, // 强制使用认证用户ID
    userName: payload.userName,
    userAvatar: payload.userAvatar,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  const jar = cookies();
  const key = 'starstudy_reviews_server';
  const existing = jar.get(key)?.value ?? '[]';
  const list = JSON.parse(existing) as Review[];
  list.unshift(review);
  jar.set(key, JSON.stringify(list), { httpOnly: false, path: '/' });

  return review;
}
