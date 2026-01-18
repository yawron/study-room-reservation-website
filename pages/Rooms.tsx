import React, { useEffect, useState } from 'react';
import { api } from '../services/apiService';
import { Room, RoomType } from '../types';
import { Button, Badge } from '../components/UI';
import { BookingModal } from '../components/BookingModal';
import { Users, Wifi, Filter } from 'lucide-react';

export const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('全部');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const category = typeFilter === '全部' ? 'All' : typeFilter;
        // Fetch by category first
        const data = await api.getRooms(category);
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [typeFilter]);

  // Apply Client-side Capacity Filter
  useEffect(() => {
    let result = rooms;
    
    if (capacityFilter !== 'all') {
        const cap = parseInt(capacityFilter);
        if (capacityFilter === '5+') {
            result = result.filter(r => r.capacity >= 5);
        } else {
            result = result.filter(r => r.capacity === cap);
        }
    }
    
    setFilteredRooms(result);
  }, [rooms, capacityFilter]);

  const typeFilters = ['全部', ...Object.values(RoomType)];
  
  const capacityOptions = [
      { label: '人数不限', value: 'all' },
      { label: '1 人', value: '1' },
      { label: '2 人', value: '2' },
      { label: '4 人', value: '4' },
      { label: '5 人及以上', value: '5+' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 space-y-6">
        <div>
           <h1 className="text-3xl font-bold text-brand-dark">所有学习空间</h1>
           <p className="text-gray-500 mt-2">找到最适合您工作与学习的氛围。</p>
        </div>
        
        {/* Filter Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {/* Type Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide flex-1">
            {typeFilters.map((f) => (
                <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    typeFilter === f 
                    ? 'bg-brand-green text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                >
                {f}
                </button>
            ))}
            </div>

            {/* Capacity Filter */}
            <div className="flex items-center space-x-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select 
                    className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                >
                    {capacityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20">
              <p className="text-gray-500 text-lg">没有找到符合条件的座位。</p>
              <Button variant="ghost" onClick={() => { setTypeFilter('全部'); setCapacityFilter('all'); }} className="mt-4">清除筛选</Button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
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

      {selectedRoom && (
        <BookingModal 
          room={selectedRoom} 
          isOpen={!!selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
          onSuccess={() => {
              // Refresh logic can be handled here or just close
              setSelectedRoom(null);
          }} 
        />
      )}
    </div>
  );
};