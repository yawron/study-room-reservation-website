'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/apiService';
import { Room, Review } from '@/types';
import { Button, Badge } from '@/components/Primitives';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 mb-6 hidden md:block">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-black hover:text-brand-green transition-colors font-black uppercase tracking-wide group"
        >
          <div className="bg-white border-2 border-black p-1 mr-2 shadow-neo-sm group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
             <ArrowLeft className="w-5 h-5" />
          </div>
          返回列表
        </button>
      </div>

      {/* Mobile Header with Back Button */}
      <div className="md:hidden sticky top-[64px] z-30 bg-brand-cream px-4 py-3 flex items-center border-b-4 border-black">
        <button onClick={() => router.back()} className="p-1 -ml-1 mr-2 text-black bg-white border-2 border-black shadow-neo-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-black text-black truncate ml-2">{room.name}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8">
        <div className="bg-white md:border-4 border-b-4 border-black md:shadow-neo overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left: Image Section */}
          <div className="lg:w-1/2 relative h-64 md:h-[500px] lg:h-auto border-b-4 lg:border-b-0 lg:border-r-4 border-black group overflow-hidden">
            <img 
              src={room.imageUrl} 
              alt={room.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-brand-green/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
               <span className="bg-brand-green text-white border-2 border-black px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-black uppercase tracking-wider shadow-neo-sm">
                 {room.type}
               </span>
            </div>
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                <Badge variant={room.isAvailable ? 'success' : 'danger'} className="text-sm py-1 px-3">
                    {room.isAvailable ? '当前空闲' : '已满员'}
                </Badge>
            </div>
          </div>

          {/* Right: Content Section */}
          <div className="lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col bg-white">
            <div className="mb-auto">
              <h1 className="hidden md:block text-3xl lg:text-5xl font-black text-black mb-4 leading-tight uppercase">
                {room.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 items-center mb-8 pb-6 border-b-4 border-black border-dashed">
                <div className="flex items-center bg-gray-100 border-2 border-black px-3 py-1.5 shadow-neo-sm">
                    <Users className="w-4 h-4 mr-2 text-black" />
                    <span className="font-bold text-sm text-black">容纳 {room.capacity} 人</span>
                </div>
                
                <button 
                    onClick={handleFeedbackClick}
                    className="flex items-center bg-brand-yellow border-2 border-black px-3 py-1.5 hover:bg-brand-yellow/80 transition-all shadow-neo-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] cursor-pointer group"
                    title="撰写评价"
                >
                    <Star className="w-4 h-4 mr-2 text-black fill-current" />
                    <span className="font-black text-sm text-black">{averageRating}</span>
                    <span className="text-xs text-black font-bold ml-1">({reviews.length} 条评价)</span>
                    <MessageSquare className="w-3.5 h-3.5 ml-2 text-black opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-black text-black mb-4 uppercase flex items-center">
                  <span className="w-2 h-8 bg-brand-green mr-2 border border-black"></span>
                  空间介绍
                </h3>
                <p className="text-black font-medium leading-relaxed text-base border-l-4 border-gray-200 pl-4">
                  {room.description}
                  <br className="mb-2 block" />
                  在此空间，您可以享受到极致的静谧与舒适。无论是独自沉浸在书海，还是与伙伴碰撞思维的火花，这里都是您的不二之选。
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-black text-black mb-4 uppercase flex items-center">
                  <span className="w-2 h-8 bg-brand-green mr-2 border border-black"></span>
                  设施配套
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center text-black bg-white p-3 border-2 border-black shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                      <div className="text-black mr-3 bg-brand-green/20 p-1 border border-black rounded-sm">
                        {getAmenityIcon(item)}
                      </div>
                      <span className="font-bold text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                 <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                     <h3 className="text-xl font-black text-black uppercase">用户评价</h3>
                     <Button variant="outline" size="sm" onClick={handleFeedbackClick} className="text-xs border-2">写评价</Button>
                 </div>
                 
                 {reviews.length === 0 ? (
                     <div className="text-center py-8 bg-gray-50 border-2 border-black border-dashed">
                         <p className="text-gray-500 font-bold text-sm">暂无评价，快来抢占沙发吧！</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {reviews.slice(0, 3).map((review) => (
                             <div key={review.id} className="bg-white border-2 border-black p-4 shadow-neo-sm">
                                 <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center">
                                         <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 border-2 border-black rounded-full bg-gray-200 mr-3" />
                                         <div>
                                             <p className="text-sm font-black text-black">{review.userName}</p>
                                             <div className="flex items-center mt-1">
                                                 {[1,2,3,4,5].map(s => (
                                                     <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-black fill-black' : 'text-gray-300'}`} />
                                                 ))}
                                             </div>
                                         </div>
                                     </div>
                                     <span className="text-xs font-bold text-gray-500 border border-black px-2 py-0.5 bg-gray-100">{new Date(review.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <p className="text-sm text-black font-medium pl-13 border-l-2 border-gray-300 ml-5 pl-4">{review.comment}</p>
                             </div>
                         ))}
                         {reviews.length > 3 && (
                             <div className="text-center pt-2">
                                 <button className="text-sm text-black font-black hover:bg-brand-green hover:text-white px-4 py-1 border-2 border-transparent hover:border-black transition-all">查看全部 {reviews.length} 条评价</button>
                             </div>
                         )}
                     </div>
                 )}
              </div>
            </div>

            <div className="hidden md:flex mt-10 pt-8 border-t-4 border-black items-center justify-between bg-gray-50 -mx-8 -mb-8 lg:-mx-12 lg:-mb-12 p-8 lg:p-12">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">每小时价格</p>
                <div className="flex items-baseline text-black">
                  <span className="text-4xl font-black">
                    {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                  </span>
                  <span className="text-gray-600 font-bold ml-1">/ 小时</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="px-10 text-xl shadow-neo border-2 border-black hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-brand-green text-white"
                onClick={() => setIsBookingModalOpen(true)}
              >
                立即预订
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 pb-safe z-40">
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase">价格</span>
                <div className="flex items-baseline text-black">
                    <span className="text-2xl font-black">
                        {room.pricePerHour === 0 ? '免费' : `¥${room.pricePerHour}`}
                    </span>
                    <span className="text-xs text-gray-600 font-bold ml-1">/ 小时</span>
                </div>
            </div>
            <Button 
                size="md" 
                className="flex-1 shadow-neo border-2 border-black font-black text-lg bg-brand-green text-white hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
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
