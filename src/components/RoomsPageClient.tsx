'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Room, RoomType } from '@/types';
import { Badge, Button } from '@/components/Primitives';
import { ChevronDown, Filter, MessageSquare, ArrowRight, Star, Users, Wifi } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FeedbackModal } from '@/components/FeedbackModal';

export default function RoomsPageClient({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(initialRooms);
  const router = useRouter();

  const [typeFilter, setTypeFilter] = useState<string>('全部');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [selectedFeedbackRoom, setSelectedFeedbackRoom] = useState<Room | null>(null);

  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  useEffect(() => {
    const category = typeFilter === '全部' ? 'All' : typeFilter;
    const nextRooms =
      category === 'All' ? rooms : rooms.filter((r) => r.type === category);
    let result = nextRooms;
    if (capacityFilter !== 'all') {
      const cap = parseInt(capacityFilter);
      if (capacityFilter === '5+') {
        result = result.filter((r) => r.capacity >= 5);
      } else {
        result = result.filter((r) => r.capacity === cap);
      }
    }
    setFilteredRooms(result);
  }, [rooms, typeFilter, capacityFilter]);

  const typeFilters = useMemo(() => ['全部', ...Object.values(RoomType)], []);
  const capacityOptions = useMemo(
    () => [
      { label: '人数不限', value: 'all' },
      { label: '单人座 (1人)', value: '1' },
      { label: '双人座 (2人)', value: '2' },
      { label: '小组座 (4人)', value: '4' },
      { label: '多人间 (5+人)', value: '5+' },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
        <div className="mb-2 md:mb-6 px-1">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-dark">所有学习空间</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2">找到最适合您工作与学习的氛围。</p>
        </div>

        <div className="sticky top-[64px] md:top-20 z-30 bg-white/95 backdrop-blur-xl py-3 mb-6 border-b md:border-b-0 md:border md:border-gray-200/60 -mx-3 px-4 md:mx-0 md:px-5 shadow-sm flex items-center gap-4 transition-all">
          <div className="flex items-center flex-shrink-0 relative group pl-1">
            <div className="bg-brand-green/10 p-2 rounded-lg mr-2">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-brand-green" />
            </div>
            <div className="relative flex items-center cursor-pointer">
              <select
                className="appearance-none bg-transparent font-bold text-sm md:text-base text-brand-dark outline-none cursor-pointer pr-6 py-1 z-10"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
              >
                {capacityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400 absolute right-0 pointer-events-none" />
            </div>
          </div>

          <div className="h-6 w-px bg-gray-200 flex-shrink-0"></div>

          <div className="flex-1 min-w-0">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-1">
              {typeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    typeFilter === f
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

        {filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">没有找到符合条件的座位。</p>
            <Button
              variant="ghost"
              onClick={() => {
                setTypeFilter('全部');
                setCapacityFilter('all');
              }}
              className="mt-4"
            >
              清除筛选
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 pb-10">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => router.push(`/rooms/${room.id}`)}
                className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full border border-gray-100 cursor-pointer"
              >
                <div className="relative h-32 xs:h-40 md:h-56 overflow-hidden">
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

                  <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
                    <span className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider truncate max-w-[90%] block">
                      {room.type}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <h3 className="text-sm md:text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-1">
                      {room.name}
                    </h3>
                    <div className="flex items-center text-[10px] md:text-xs text-gray-400 md:hidden ml-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-brand-gold fill-current mr-0.5" /> 4.9
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 md:space-x-4 text-[10px] md:text-sm text-gray-500 mb-2 md:mb-4">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {room.capacity}人
                    </div>
                    <div className="flex items-center truncate max-w-[60px] md:max-w-none">
                      <Wifi className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      WiFi
                    </div>
                  </div>

                  <p className="hidden md:block text-gray-600 text-xs md:text-sm line-clamp-2 mb-4 md:mb-6 flex-grow">
                    {room.description}
                  </p>

                  <div className="pt-2 md:pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-sm md:text-lg font-bold text-brand-green">
                        {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-400"> / 小时</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedbackRoom(room);
                        }}
                        className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors"
                        title="提交反馈"
                      >
                        <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                      </button>

                      <div className="md:hidden bg-brand-green/10 p-1.5 rounded-full">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-green" />
                      </div>
                      <Button variant="ghost" size="sm" className="hidden md:flex group-hover:bg-brand-accent/20 px-2 md:px-4 text-xs md:text-sm">
                        详情 <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedFeedbackRoom && (
          <FeedbackModal room={selectedFeedbackRoom} isOpen={!!selectedFeedbackRoom} onClose={() => setSelectedFeedbackRoom(null)} />
        )}
      </div>
    </div>
  );
}
