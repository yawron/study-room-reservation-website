'use server';

import { cookies } from 'next/headers';
import { Booking } from '@/types';

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
    userId: payload.userId,
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
