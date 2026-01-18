'use client';

import React, { useEffect } from 'react';
import { Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
import { Room } from '../types';
import { Button, Input } from './UI';
import { useRouter } from 'next/navigation';
import { useReservation } from '../hooks/useReservation';
import { Modal } from './Modal'; 

interface BookingModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ room, isOpen, onClose, onSuccess }) => {
  const router = useRouter();

  // Custom Hook: Reservation Logic
  const { 
    step, setStep, date, setDate, startTime, setStartTime, 
    duration, setDuration, isSubmitting, submitReservation, 
    reset, isAuthenticated 
  } = useReservation(room, onSuccess);

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, room]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      onClose();
      router.push('/login');
      return;
    }
    await submitReservation();
    setTimeout(() => onClose(), 2000); 
  };

  return (
    <Modal.Root isOpen={isOpen} onClose={handleClose}>
        <Modal.Header>
          {step === 3 ? '预订成功!' : `预订 ${room.name}`}
        </Modal.Header>

        <Modal.Body>
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <img src={room.imageUrl} alt={room.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" />
                <div>
                  <h3 className="font-semibold text-brand-dark">{room.type}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.description}</p>
                  <p className="text-brand-green font-bold mt-2">
                    {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour} / 小时`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input 
                  type="date" 
                  label="选择日期" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      <option value="">选择时间</option>
                      {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">使用时长</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4].map(h => (
                        <option key={h} value={h}>{h} 小时</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-brand-accent/20 p-4 rounded-lg flex items-center justify-between">
                <span className="text-brand-dark font-medium">预计总价</span>
                <span className="text-xl font-bold text-brand-green">
                  ¥{room.pricePerHour * duration}
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-brand-green" />
                  <span>{new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-brand-green" />
                  <span>{startTime} ({duration} 小时)</span>
                </div>
                <div className="flex items-center text-gray-700">
                   <CreditCard className="w-5 h-5 mr-3 text-brand-green" />
                   <span>总计: ¥{room.pricePerHour * duration}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>点击确认即表示您同意我们的自习室规则：保持安静，保持环境整洁。</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">预订成功！</h3>
              <p className="text-gray-500">预订详情已发送至您的邮箱。</p>
            </div>
          )}
        </Modal.Body>
        
        {step !== 3 && (
            <Modal.Footer>
                 {step === 1 && (
                     <Button 
                        className="w-full" 
                        onClick={() => setStep(2)}
                        disabled={!date || !startTime}
                     >
                        下一步: 确认订单
                     </Button>
                 )}
                 {step === 2 && (
                     <>
                        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>返回</Button>
                        <Button 
                            className="flex-1" 
                            onClick={handleBooking}
                            isLoading={isSubmitting}
                        >
                            确认预订
                        </Button>
                     </>
                 )}
            </Modal.Footer>
        )}
    </Modal.Root>
  );
};