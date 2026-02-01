'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/apiService';
import { Booking } from '@/types';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button, Badge } from '@/components/Primitives';

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

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center bg-brand-cream"><div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-brand-cream min-h-screen">
      <div className="bg-white rounded-lg shadow-neo border-2 border-black p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
            <img src={user?.avatar} alt={user?.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-black shadow-sm" />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full"></div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-black uppercase">欢迎回来，{user?.name}</h1>
          <p className="text-gray-600 mt-2 font-bold">您当前有 <span className="font-black text-brand-green text-xl">{bookings.filter(b => b.status === 'confirmed').length}</span> 个有效预订。</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-black uppercase border-l-8 border-brand-accent pl-4">您的预订记录</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-black border-dashed shadow-neo-sm">
           <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
           <p className="text-gray-600 font-bold mb-6 text-lg">暂无预订记录</p>
           <Button onClick={() => router.push('/rooms')} className="border-2 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">去预订</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-neo hover:shadow-neo-lg transition-all p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center border-2 border-black group">
              <div className="flex-shrink-0 w-full md:w-48 mb-4 md:mb-0 md:mr-6">
                <img src={booking.imageUrl} alt="Room" className="w-full h-36 md:h-32 object-cover rounded-md border-2 border-black shadow-sm transition-all" />
              </div>
              
              <div className="flex-grow space-y-3 w-full">
                 <div className="flex flex-row items-center justify-between">
                    <h3 className="text-xl font-black text-black truncate pr-2">{booking.roomName}</h3>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'warning' : 'neutral'}
                      className="border-2 border-black shadow-sm"
                    >
                        {getStatusLabel(booking.status)}
                    </Badge>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm font-bold text-gray-600 bg-gray-100 p-3 rounded-md border-2 border-black md:border-0 md:bg-transparent md:p-0">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-black flex-shrink-0"/>
                        {new Date(booking.date).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-black flex-shrink-0"/>
                        {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-black flex-shrink-0"/>
                        主图书馆
                    </div>
                 </div>
              </div>

              {booking.status === 'confirmed' && (
                  <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-auto pt-4 md:pt-0 border-t-2 md:border-t-0 border-black flex justify-end">
                      <Button variant="outline" size="sm" className="text-red-600 border-2 border-black hover:bg-red-50 w-full md:w-auto font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]" onClick={() => handleCancel(booking.id)}>
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
