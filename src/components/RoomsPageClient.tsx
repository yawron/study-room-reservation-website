'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Room, RoomType } from '@/types';
import { Badge, Button } from '@/components/Primitives';
import { ChevronDown, Filter, MessageSquare, ArrowRight, Star, Users, Wifi } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeedbackModal } from '@/components/FeedbackModal';

export default function RoomsPageClient({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(initialRooms);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [typeFilter, setTypeFilter] = useState<string>('全部');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [selectedFeedbackRoom, setSelectedFeedbackRoom] = useState<Room | null>(null);

  useEffect(() => {
    const typeParam = searchParams?.get('type');
    if (typeParam) {
      // Decode URI component to handle Chinese characters correctly
      const decodedType = decodeURIComponent(typeParam);
      // Check if the decoded type is a valid RoomType value
      if (Object.values(RoomType).includes(decodedType as RoomType)) {
        setTypeFilter(decodedType);
      }
    }
  }, [searchParams]);

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
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        <div className="mb-6 md:mb-10 px-1 border-l-8 border-primary pl-6">
          <h1 className="text-3xl md:text-5xl font-black text-black mb-2 uppercase tracking-tight">所有学习空间</h1>
          <p className="text-base md:text-xl font-bold text-gray-600">找到最适合您工作与学习的氛围</p>
        </div>

        <div className="sticky top-[64px] md:top-20 z-30 bg-white border-2 border-black shadow-neo rounded-lg p-4 mb-8 -mx-1 md:mx-0 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 transition-all">
          <div className="flex items-center flex-shrink-0 relative w-full md:w-auto">
            <div className="bg-brand-green p-2 border-2 border-black shadow-sm mr-3 flex-shrink-0">
              <Filter className="w-5 h-5 text-black" />
            </div>
            <div className="relative flex-grow md:flex-grow-0">
              <select
                className="w-full md:w-auto appearance-none bg-white border-2 border-black px-4 py-2 pr-10 font-bold text-black focus:outline-none focus:ring-0 cursor-pointer shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
              >
                {capacityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-black absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="hidden md:block h-8 w-0.5 bg-black flex-shrink-0"></div>

          <div className="w-full overflow-x-auto py-2 scrollbar-hide">
            <div className="flex space-x-3">
              {typeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-4 py-2 border-2 border-black font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    typeFilter === f
                      ? 'bg-brand-green text-black shadow-neo-sm -translate-y-1'
                      : 'bg-white text-gray-600 hover:bg-brand-accent hover:text-black hover:shadow-neo-sm hover:-translate-y-1'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-black shadow-neo rounded-lg p-10">
            <p className="text-black font-bold text-xl mb-4">没有找到符合条件的座位。</p>
            <Button
              variant="outline"
              onClick={() => {
                setTypeFilter('全部');
                setCapacityFilter('all');
              }}
              className="mt-2"
            >
              清除筛选
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => router.push(`/rooms/${room.id}`)}
                className="bg-white rounded-lg border-2 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col h-full cursor-pointer overflow-hidden"
              >
                <div className="relative h-40 sm:h-48 border-b-2 border-black overflow-hidden">
                  <Image src={room.imageUrl} alt={room.name} fill className="object-cover transition-all duration-500" />

                  <div className="absolute top-3 right-3 flex gap-2">
                    {room.isAvailable ? (
                      <Badge variant="success" className="border-2 border-black shadow-sm font-bold px-3 py-1 text-xs md:text-sm">
                        空闲
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="border-2 border-black shadow-sm font-bold px-3 py-1 text-xs md:text-sm">
                        满员
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="bg-brand-accent border-2 border-black text-black px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm">
                      {room.type}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-black group-hover:text-primary transition-colors line-clamp-1">
                      {room.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 text-sm font-bold text-gray-600 mb-4">
                    <div className="flex items-center bg-gray-100 px-2 py-1 border border-black rounded-md">
                      <Users className="w-4 h-4 mr-1.5" />
                      {room.capacity}人
                    </div>
                    <div className="flex items-center bg-gray-100 px-2 py-1 border border-black rounded-md">
                      <Wifi className="w-4 h-4 mr-1.5" />
                      WiFi
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm font-medium line-clamp-2 mb-6 flex-grow border-l-4 border-gray-200 pl-3">
                    {room.description}
                  </p>

                  <div className="pt-4 border-t-2 border-black flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xl font-black text-black bg-brand-green/20 px-2 py-0.5 rounded-sm">
                        {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                      </span>
                      <span className="text-xs font-bold text-gray-500 ml-1">/ 小时</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="primary" size="sm" className="hidden md:flex text-sm">
                        详情 <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      <div className="md:hidden bg-black text-white p-2 rounded-md border-2 border-black">
                         <ArrowRight className="w-4 h-4" />
                      </div>
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
