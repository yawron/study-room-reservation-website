import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../components/UI';
import { Wifi, Coffee, Users, Zap, Search } from 'lucide-react';
import { api } from '../services/apiService';
import { Room, RoomType } from '../types';
import { BookingModal } from '../components/BookingModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('全部');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        // Map '全部' to 'All' or empty for the mock service
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
      {/* Hero Section - Simplified for utility */}
      <section className="relative bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              预订您的专属 <span className="text-brand-accent">学习空间</span>
            </h1>
            <p className="text-gray-200 max-w-lg mb-8 text-lg">
              像星巴克一样舒适，专为高效学习打造。实时查询，即刻预订。
            </p>
        </div>
      </section>

      {/* Booking Section (Moved from Rooms page) */}
      <section className="flex-grow bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar */}
          <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm py-4 mb-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-brand-dark font-bold text-lg">
               <Search className="w-5 h-5" />
               <span>快速选座</span>
            </div>
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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

          {/* Room Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={room.imageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant={room.isAvailable ? 'success' : 'neutral'}>
                        {room.isAvailable ? '当前空闲' : '已满员'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {room.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-brand-dark">{room.name}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center"><Users className="w-4 h-4 mr-1"/> {room.capacity} 人座</div>
                      <div className="flex items-center"><Wifi className="w-4 h-4 mr-1"/> 免费 WiFi</div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">{room.description}</p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-lg font-bold text-brand-green">
                          {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                        </span>
                        <span className="text-xs text-gray-400"> / 小时</span>
                      </div>
                      <Button onClick={() => setSelectedRoom(room)}>立即预订</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights (Moved below folding) */}
      <section className="py-16 bg-brand-cream border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <Wifi className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">极速光纤网络</h3>
              <p className="text-gray-600 text-sm">千兆网络接入，确保查阅资料与视频课程流畅无卡顿。</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <Zap className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">即时预约系统</h3>
              <p className="text-gray-600 text-sm">实时查看座位状态，秒级锁定您的专属学习空间。</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <Coffee className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-2">沉浸式氛围</h3>
              <p className="text-gray-600 text-sm">精心设计的灯光与人体工学座椅，助您快速进入心流状态。</p>
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
};