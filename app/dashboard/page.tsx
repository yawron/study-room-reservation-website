'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/apiService';
import { Booking } from '@/types';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button, Badge } from '@/components/UI';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      if (user) {
        try {
          const data = await api.getUserBookings(user.id);
          setBookings(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user, isAuthenticated, router]);

  const handleCancel = async (id: string) => {
    if(window.confirm('您确定要取消此预订吗？')) {
        await api.cancelBooking(id);
        const updated = await api.getUserBookings(user!.id);
        setBookings(updated);
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
        case 'confirmed': return '已确认';
        case 'cancelled': return '已取消';
        case 'completed': return '已完成';
        default: return status;
    }
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
            <img src={user?.avatar} alt={user?.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-brand-accent" />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-dark">欢迎回来，{user?.name}</h1>
          <p className="text-gray-500 mt-1">您当前有 <span className="font-bold text-brand-green">{bookings.filter(b => b.status === 'confirmed').length}</span> 个有效预订。</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-dark">您的预订记录</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
           <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500 mb-4">暂无预订记录</p>
           <Button onClick={() => router.push('/rooms')}>去预订</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center border border-gray-100 group">
              <div className="flex-shrink-0 w-full md:w-40 mb-4 md:mb-0 md:mr-6">
                <img src={booking.imageUrl} alt="Room" className="w-full h-36 md:h-28 object-cover rounded-lg shadow-sm" />
              </div>
              
              <div className="flex-grow space-y-3 w-full">
                 <div className="flex flex-row items-center justify-between">
                    <h3 className="text-lg font-bold text-brand-dark truncate pr-2">{booking.roomName}</h3>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'warning' : 'neutral'}>
                        {getStatusLabel(booking.status)}
                    </Badge>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg md:bg-transparent md:p-0">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-brand-green flex-shrink-0"/>
                        {new Date(booking.date).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-brand-green flex-shrink-0"/>
                        {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-brand-green flex-shrink-0"/>
                        主图书馆
                    </div>
                 </div>
              </div>

              {booking.status === 'confirmed' && (
                  <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full md:w-auto" onClick={() => handleCancel(booking.id)}>
                        取消预订
                      </Button>
                  </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}