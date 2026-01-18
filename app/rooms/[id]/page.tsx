'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/apiService';
import { Room, Review } from '@/types';
import { Button, Badge } from '@/components/UI';
import { Wifi, Users, ArrowLeft, CheckCircle2, Zap, Monitor, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useAuth } from '@/context/AuthContext';

export default function RoomDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const fetchRoomData = async () => {
      if (!id) return;
      try {
        const [roomData, reviewsData] = await Promise.all([
            api.getRoomById(id),
            api.getRoomReviews(id)
        ]);
        setRoom(roomData || null);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="animate-spin h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">未找到该自习室</h2>
        <Button onClick={() => router.push('/rooms')}>返回列表</Button>
      </div>
    );
  }

  const getAmenityIcon = (text: string) => {
    if (text.includes('WiFi')) return <Wifi className="w-5 h-5" />;
    if (text.includes('显示器')) return <Monitor className="w-5 h-5" />;
    if (text.includes('电源')) return <Zap className="w-5 h-5" />;
    return <CheckCircle2 className="w-5 h-5" />;
  };

  const handleFeedbackClick = () => {
      if (!isAuthenticated) {
          router.push('/login');
          return;
      }
      setIsFeedbackModalOpen(true);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  return (
    <div className="min-h-screen bg-brand-cream pb-24 lg:pb-20">
      {/* Back Button (Desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 mb-4 hidden md:block">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-brand-green transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回列表
        </button>
      </div>

      {/* Mobile Header with Back Button */}
      <div className="md:hidden sticky top-[64px] z-30 bg-brand-cream/95 backdrop-blur-sm px-4 py-3 flex items-center border-b border-gray-200/50">
        <button onClick={() => router.back()} className="p-1 -ml-1 mr-2 text-brand-dark">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-brand-dark truncate">{room.name}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8">
        <div className="bg-white md:rounded-3xl shadow-sm md:shadow-xl overflow-hidden border-b md:border border-gray-100 flex flex-col lg:flex-row">
          
          {/* Left: Image Section */}
          <div className="lg:w-1/2 relative h-64 md:h-80 lg:h-auto group">
            <img 
              src={room.imageUrl} 
              alt={room.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden"></div>
            
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
               <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg">
                 {room.type}
               </span>
            </div>
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                <Badge variant={room.isAvailable ? 'success' : 'neutral'}>
                    {room.isAvailable ? '当前空闲' : '已满员'}
                </Badge>
            </div>
          </div>

          {/* Right: Content Section */}
          <div className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col">
            <div className="mb-auto">
              <h1 className="hidden md:block text-3xl lg:text-4xl font-bold text-brand-dark mb-4 leading-tight">
                {room.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 items-center text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Users className="w-4 h-4 mr-2 text-brand-green" />
                    <span className="font-medium text-sm">容纳 {room.capacity} 人</span>
                </div>
                
                <button 
                    onClick={handleFeedbackClick}
                    className="flex items-center bg-brand-gold/10 px-3 py-1.5 rounded-lg hover:bg-brand-gold/20 transition-colors cursor-pointer group"
                    title="撰写评价"
                >
                    <Star className="w-4 h-4 mr-2 text-brand-gold fill-current" />
                    <span className="font-bold text-sm text-brand-dark">{averageRating}</span>
                    <span className="text-xs text-gray-500 ml-1 group-hover:text-brand-dark">({reviews.length} 条评价)</span>
                    <MessageSquare className="w-3.5 h-3.5 ml-2 text-brand-green opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-brand-dark mb-3">空间介绍</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {room.description}
                  在此空间，您可以享受到极致的静谧与舒适。无论是独自沉浸在书海，还是与伙伴碰撞思维的火花，这里都是您的不二之选。
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-brand-dark mb-3">设施配套</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="text-brand-green mr-3">
                        {getAmenityIcon(item)}
                      </div>
                      <span className="font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                 <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-brand-dark">用户评价</h3>
                     <Button variant="ghost" size="sm" onClick={handleFeedbackClick}>写评价</Button>
                 </div>
                 
                 {reviews.length === 0 ? (
                     <div className="text-center py-6 bg-gray-50 rounded-xl">
                         <p className="text-gray-500 text-sm">暂无评价，快来抢占沙发吧！</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {reviews.slice(0, 3).map((review) => (
                             <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center">
                                         <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
                                         <div>
                                             <p className="text-sm font-bold text-gray-900">{review.userName}</p>
                                             <div className="flex items-center">
                                                 {[1,2,3,4,5].map(s => (
                                                     <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-brand-gold fill-current' : 'text-gray-300'}`} />
                                                 ))}
                                             </div>
                                         </div>
                                     </div>
                                     <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-sm text-gray-600 pl-10">{review.comment}</p>
                             </div>
                         ))}
                         {reviews.length > 3 && (
                             <div className="text-center pt-2">
                                 <button className="text-xs text-brand-green font-medium hover:underline">查看全部 {reviews.length} 条评价</button>
                             </div>
                         )}
                     </div>
                 )}
              </div>
            </div>

            <div className="hidden md:flex mt-10 pt-8 border-t border-gray-100 items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">每小时价格</p>
                <div className="flex items-baseline text-brand-green">
                  <span className="text-3xl font-bold">
                    {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                  </span>
                  <span className="text-gray-500 ml-1">/ 小时</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="px-10 shadow-xl shadow-brand-green/20 hover:scale-105 transition-transform"
                onClick={() => setIsBookingModalOpen(true)}
              >
                立即预订
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">价格</span>
                <div className="flex items-baseline text-brand-green">
                    <span className="text-2xl font-bold">
                        {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ 小时</span>
                </div>
            </div>
            <Button 
                size="md" 
                className="flex-1 shadow-lg font-bold text-lg"
                onClick={() => setIsBookingModalOpen(true)}
            >
                立即预订
            </Button>
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
        onReviewSubmitted={fetchRoomData}
      />
    </div>
  );
}