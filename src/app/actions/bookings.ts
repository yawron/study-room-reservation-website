'use server';

import { cookies } from 'next/headers';
import { Booking } from '@/types';
import { getAuthenticatedUser } from '@/lib/server-utils';

export async function submitBookingAction(payload: {
  roomId: string;
  roomName: string;
  userId: string;
  date: string;
  startTime: string;
  duration: number;
  pricePerHour: number;
  imageUrl: string;
}): Promise<Booking> {
  // 验证用户身份
  const authUserId = await getAuthenticatedUser();

  const duration = Math.max(1, Math.min(8, Math.floor(payload.duration || 1)));
  const startHour = Number.parseInt(payload.startTime?.split(':')[0] ?? '', 10);
  if (!Number.isFinite(startHour)) {
    throw new Error('invalid start time');
  }
  const endHour = startHour + duration;
  const endTime = `${endHour.toString().padStart(2, '0')}:00`;
  const totalPrice = payload.pricePerHour * duration;

  const booking: Booking = {
    id: Math.random().toString(36).slice(2, 11),
    roomId: payload.roomId,
    roomName: payload.roomName,
    userId: authUserId, // 强制使用认证用户ID
    date: payload.date,
    startTime: payload.startTime,
    endTime,
    status: 'confirmed',
    totalPrice,
    imageUrl: payload.imageUrl,
  };

  const jar = cookies();
  const key = 'starstudy_bookings_server';
  const existing = jar.get(key)?.value ?? '[]';
  const list = JSON.parse(existing) as Booking[];
  list.unshift(booking);
  jar.set(key, JSON.stringify(list), { httpOnly: false, path: '/' });

  return booking;
}

export async function getUserBookingsAction(userId: string): Promise<Booking[]> {
  const authUserId = await getAuthenticatedUser();
  
  // 确保只能查询自己的预订
  if (userId !== authUserId) {
    throw new Error('无权查看他人预订');
  }

  const jar = cookies();
  const key = 'starstudy_bookings_server';
  const existing = jar.get(key)?.value ?? '[]';
  const list = JSON.parse(existing) as Booking[];
  return list.filter(b => b.userId === userId);
}

export async function cancelBookingAction(bookingId: string): Promise<void> {
  const authUserId = await getAuthenticatedUser();

  const jar = cookies();
  const key = 'starstudy_bookings_server';
  const existing = jar.get(key)?.value ?? '[]';
  let list = JSON.parse(existing) as Booking[];
  
  // 验证预订是否存在且属于当前用户
  const booking = list.find(b => b.id === bookingId);
  if (!booking) {
    throw new Error('预订不存在');
  }
  if (booking.userId !== authUserId) {
    throw new Error('无权取消此预订');
  }

  list = list.map(b => 
    b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
  );
  
  jar.set(key, JSON.stringify(list), { httpOnly: false, path: '/' });
}
