'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room, Review } from '@/types';
import { Button, Badge } from '@/components/Primitives';
import { Wifi, Users, ArrowLeft, CheckCircle2, Zap, Monitor, Star, MessageSquare } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useAuth } from '@/context/AuthContext';

interface RoomDetailClientProps {
  initialRoom: Room;
  initialReviews: Review[];
}

export default function RoomDetailClient({ initialRoom, initialReviews }: RoomDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [room] = useState<Room>(initialRoom);
  const [reviews] = useState<Review[]>(initialReviews);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const getAmenityIcon = (text: string) => {
    if (text.includes('WiFi')) return <Wifi className="w-4 h-4" />;
    if (text.includes('显示器')) return <Monitor className="w-4 h-4" />;
    if (text.includes('电源')) return <Zap className="w-4 h-4" />;
    return <CheckCircle2 className="w-4 h-4" />;
  };

  const handleFeedbackClick = () => {
      if (!isAuthenticated) {
          router.push('/login');
          return;
      }
      setIsFeedbackModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh the page to get updated reviews
    router.refresh();
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-cream flex flex-col items-center justify-center p-4 lg:p-6 pb-12 lg:pb-16">
      <div className="w-full max-w-5xl bg-white border-4 border-black shadow-neo flex flex-col lg:flex-row overflow-hidden max-h-[85vh] lg:h-[600px]">

        {/* Left: Image Section */}
        <div className="relative w-full lg:w-1/2 h-48 lg:h-full border-b-4 lg:border-b-0 lg:border-r-4 border-black group overflow-hidden bg-gray-100 shrink-0">
            <img
              src={room.imageUrl}
              alt={room.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500"></div>

            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 z-20 bg-white border-2 border-black p-2 shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all rounded-md"
            >
               <ArrowLeft className="w-5 h-5 text-black" />
            </button>

            <div className="absolute top-4 right-4 z-20">
               <Badge variant={room.isAvailable ? 'success' : 'danger'} className="text-sm py-1 px-3 border-2 border-black shadow-neo-sm">
                 {room.isAvailable ? '当前空闲' : '已满员'}
               </Badge>
            </div>
        </div>

        {/* Right: Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                <div className="flex items-center justify-between mb-4">
                    <span className="bg-brand-green text-white border-2 border-black px-3 py-0.5 text-xs font-black uppercase tracking-wider shadow-neo-sm rounded-sm">
                        {room.type}
                    </span>
                    <div
                        onClick={handleFeedbackClick}
                        className="flex items-center cursor-pointer hover:opacity-70 transition-opacity group"
                    >
                        <div className="flex text-brand-yellow drop-shadow-sm mr-2">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 font-black text-black">{averageRating}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-500 underline decoration-2 decoration-brand-green/30 group-hover:decoration-brand-green">{reviews.length} 条评价</span>
                    </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-black text-black mb-3 leading-tight uppercase tracking-tight">
                    {room.name}
                </h1>

                <div className="flex items-center gap-3 mb-5 text-sm font-bold text-gray-700 border-b-2 border-dashed border-gray-200 pb-4">
                     <div className="flex items-center bg-gray-100 px-2 py-1 rounded border border-black/10">
                        <Users className="w-4 h-4 mr-2 text-black" />
                        <span>{room.capacity} 人</span>
                     </div>
                     <div className="flex items-center bg-gray-100 px-2 py-1 rounded border border-black/10">
                        <Monitor className="w-4 h-4 mr-2 text-black" />
                        <span>设备齐全</span>
                     </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <h3 className="text-xs font-black text-black mb-2 uppercase flex items-center text-gray-400">
                          <span className="w-1.5 h-3 bg-brand-green mr-2 border border-black"></span>
                          空间介绍
                        </h3>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed text-justify line-clamp-3 hover:line-clamp-none transition-all">
                          {room.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-black mb-2 uppercase flex items-center text-gray-400">
                          <span className="w-1.5 h-3 bg-brand-green mr-2 border border-black"></span>
                          设施配套
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((item, idx) => (
                            <div key={idx} className="flex items-center bg-white px-2 py-1 border-2 border-black shadow-neo-sm text-[10px] font-bold text-black hover:-translate-y-[1px] transition-transform">
                              {getAmenityIcon(item)}
                              <span className="ml-1">{item}</span>
                            </div>
                          ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-black text-black uppercase flex items-center text-gray-400">
                              <span className="w-1.5 h-3 bg-brand-green mr-2 border border-black"></span>
                              用户评价 ({reviews.length})
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleFeedbackClick}
                                className="text-[10px] h-6 px-2 text-brand-green hover:bg-brand-green/10"
                            >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                写评价
                            </Button>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="text-center py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="text-xs text-gray-500 mb-2">暂无评价，快来抢沙发吧！</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-white border-2 border-black p-3 shadow-neo-sm rounded-md">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 border border-black overflow-hidden shrink-0">
                                                    {review.userAvatar ? (
                                                        <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                            {review.userName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-black">{review.userName}</div>
                                                    <div className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex text-brand-yellow">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed break-words">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Action Area */}
            <div className="p-4 lg:p-5 border-t-4 border-black bg-white shrink-0 z-20">
               <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline text-black">
                      <span className="text-2xl font-black">
                        {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                      </span>
                      <span className="text-xs font-bold ml-1 text-gray-600">/ 小时</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 shadow-neo border-2 border-black text-base bg-brand-green text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    立即预订
                  </Button>
               </div>
            </div>
        </div>
      </div>

      <BookingModal
        room={room}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={() => {}}
      />

      <FeedbackModal
        room={room}
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
