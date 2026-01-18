import { useState } from 'react';
import { api } from '../services/apiService';
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
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = startHour + duration;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      const totalPrice = room.pricePerHour * duration;

      await api.createBooking({
        roomId: room.id,
        roomName: room.name,
        userId: user.id,
        date,
        startTime,
        endTime,
        totalPrice,
        imageUrl: room.imageUrl,
      });

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