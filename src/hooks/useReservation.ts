import { useState } from 'react';
import { submitBookingAction } from '@/app/actions/bookings';
import { Room } from '../types';
import { useAuth } from '../context/AuthContext';

export const useReservation = (room: Room, onSuccess: () => void) => {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReservation = async () => {
    if (!isAuthenticated || !user) {
      throw new Error("User not authenticated");
    }

    setIsSubmitting(true);
    try {
      // 构造预定数据并提交到 Server Action
      // Server Action 会负责校验、计算价格并入库
      await submitBookingAction({
        roomId: room.id,
        roomName: room.name,
        userId: user.id,
        date,
        startTime,
        duration,
        pricePerHour: room.pricePerHour,
        imageUrl: room.imageUrl,
      });

      // 预订成功后，无需再调用 api.createBooking
      // 因为数据已经在 submitBookingAction 中处理并持久化了

      setStep(3); // Move to success step
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Reservation failed:", error);
      // In a real app, you might set an error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDate('');
    setStartTime('');
    setDuration(1);
    setIsSubmitting(false);
  };

  return {
    step,
    setStep,
    date,
    setDate,
    startTime,
    setStartTime,
    duration,
    setDuration,
    isSubmitting,
    submitReservation,
    reset,
    isAuthenticated,
    user
  };
};
