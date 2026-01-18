'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/UI';
import { Wifi, Coffee, Users, Zap, Search, ArrowRight, Star } from 'lucide-react';
import { api } from '@/services/apiService';
import { Room, RoomType } from '@/types';
import { BookingModal } from '@/components/BookingModal';

export default function HomePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('全部');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const category = filter === '全部' ? 'All' : filter;
        const data = await api.getRooms(category);
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [filter]);

  const filters = ['全部', ...Object.values(RoomType)];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-brand-dark overflow-hidden min-h-[360px] md:min-h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mt-6 mb-6">
              预订您的专属 <br className="md:hidden"/> <span className="text-brand-accent">学习空间</span>
            </h1>
            <p className="text-gray-200 max-w-lg mb-8 text-base md:text-lg px-4 line-clamp-2 md:line-clamp-none">
              像星巴克一样舒适，专为高效学习打造。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
                <Button size="lg" className="w-full sm:w-auto text-lg shadow-xl shadow-brand-green/30" onClick={() => router.push('/rooms')}>
                    开始预约
                </Button>
            </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow bg-white min-h-screen py-4 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Sticky Filter Bar */}
          <div className="sticky top-[64px] md:top-20 z-30 bg-white/95 backdrop-blur-sm py-2 md:py-4 mb-4 border-b border-gray-100 -mx-3 px-3 md:mx-0 md:px-0 shadow-sm md:shadow-none flex items-center gap-3">
            <div className="flex items-center text-brand-dark font-bold text-base flex-shrink-0">
               <div className="bg-brand-green/10 p-2 rounded-lg">
                 <Search className="w-4 h-4 md:w-5 md:h-5 text-brand-green" />
               </div>
               <span className="hidden md:inline ml-2">快速选座</span>
            </div>
            
            <div className="h-6 w-px bg-gray-200 md:hidden flex-shrink-0"></div>

            <div className="flex-1 min-w-0">
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      filter === f 
                      ? 'bg-brand-green text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Room Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-48 md:h-80 bg-gray-100 rounded-xl md:rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 pb-10">
              {rooms.map((room) => (
                <div 
                    key={room.id} 
                    onClick={() => router.push(`/rooms/${room.id}`)}
                    className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full border border-gray-100 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-28 xs:h-36 md:h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={room.imageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    <div className="absolute top-2 right-2 md:top-3 md:right-3">
                      {room.isAvailable ? (
                          <span className="flex h-2.5 w-2.5 md:hidden relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                      ) : (
                          <span className="flex h-2.5 w-2.5 md:hidden relative">
                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-400"></span>
                          </span>
                      )}
                      <div className="hidden md:block">
                        <Badge variant={room.isAvailable ? 'success' : 'neutral'}>
                            {room.isAvailable ? '空闲' : '满员'}
                        </Badge>
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 max-w-[85%]">
                      <span className="bg-black/60 backdrop-blur-md text-white px-1.5 py-0.5 md:px-2.5 md:py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider truncate block">
                        {room.type}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-2.5 md:p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                      <h3 className="text-sm md:text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-1">{room.name}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:space-x-4 text-[10px] md:text-sm text-gray-500 mb-2 md:mb-3">
                      <div className="flex items-center"><Users className="w-3 h-3 md:w-4 md:h-4 mr-1"/>{room.capacity}人</div>
                      <div className="flex items-center"><Wifi className="w-3 h-3 md:w-4 md:h-4 mr-1"/>WiFi</div>
                    </div>

                    <p className="hidden md:block text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{room.description}</p>

                    <div className="pt-2 md:pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                      <div>
                        <span className="text-sm md:text-lg font-bold text-brand-green">
                          {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-400">/h</span>
                      </div>
                      <Button variant="ghost" size="sm" className="hidden md:flex group-hover:bg-brand-accent/20 px-2 md:px-4 text-xs md:text-sm">
                          详情 <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-8 md:py-16 bg-brand-cream border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 md:gap-10">
            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-white p-2 md:p-4 rounded-full mb-2 md:mb-4 shadow-sm text-brand-green">
                <Wifi className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xs md:text-lg font-bold text-brand-dark mb-1">极速网络</h3>
              <p className="hidden md:block text-gray-600 text-sm">千兆网络接入，确保查阅资料与视频课程流畅无卡顿。</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-white p-2 md:p-4 rounded-full mb-2 md:mb-4 shadow-sm text-brand-green">
                <Zap className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xs md:text-lg font-bold text-brand-dark mb-1">即时预约</h3>
              <p className="hidden md:block text-gray-600 text-sm">实时查看座位状态，秒级锁定您的专属学习空间。</p>
            </div>

            <div className="flex flex-col items-center text-center p-2">
              <div className="bg-white p-2 md:p-4 rounded-full mb-2 md:mb-4 shadow-sm text-brand-green">
                <Coffee className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xs md:text-lg font-bold text-brand-dark mb-1">舒适氛围</h3>
              <p className="hidden md:block text-gray-600 text-sm">精心设计的灯光与人体工学座椅，助您快速进入心流状态。</p>
            </div>
          </div>
        </div>
      </section>

      {selectedRoom && (
        <BookingModal 
          room={selectedRoom} 
          isOpen={!!selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
          onSuccess={() => setFilter(filter)} 
        />
      )}
    </div>
  );
}