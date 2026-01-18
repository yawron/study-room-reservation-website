'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './UI';
import { Room } from '../types';
import { Star, ThumbsUp } from 'lucide-react';
import { api } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface FeedbackModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ room, isOpen, onClose, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
        onClose();
        router.push('/login');
        return;
    }

    setIsSubmitting(true);
    try {
        await api.addReview({
            roomId: room.id,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            rating,
            comment
        });
        
        setIsSubmitting(false);
        setIsSuccess(true);
        if (onReviewSubmitted) onReviewSubmitted();
        
        setTimeout(() => {
            onClose();
            // 重置状态
            setTimeout(() => {
                setIsSuccess(false);
                setComment('');
                setRating(5);
            }, 300);
        }, 1500);
    } catch (e) {
        setIsSubmitting(false);
        console.error(e);
    }
  };

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        {isSuccess ? '提交成功' : `评价 - ${room.name}`}
      </Modal.Header>
      <Modal.Body>
        {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">感谢您的评价!</h3>
                <p className="text-gray-500 mt-2">您的反馈将帮助我们和其他同学。</p>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="bg-gray-50 p-3 rounded-lg flex items-start space-x-3">
                    <img src={room.imageUrl} alt={room.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    <div>
                        <p className="font-medium text-brand-dark text-sm">{room.name}</p>
                        <p className="text-xs text-gray-500">{room.type}</p>
                    </div>
                </div>

                {/* Star Rating Selection */}
                <div className="flex flex-col items-center space-y-2 py-2">
                    <label className="text-sm font-medium text-gray-700">总体评分</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transform hover:scale-110 transition-transform"
                            >
                                <Star 
                                    className={`w-8 h-8 ${star <= rating ? 'text-brand-gold fill-current' : 'text-gray-300'}`} 
                                />
                            </button>
                        ))}
                    </div>
                    <span className="text-xs text-brand-green font-medium">
                        {rating === 5 ? '非常满意' : rating === 4 ? '满意' : rating === 3 ? '一般' : '需改进'}
                    </span>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">详细评价</label>
                    <textarea 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none min-h-[100px] resize-none text-sm transition-shadow"
                        placeholder="分享您的使用体验，例如：环境、网络速度、舒适度等..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>
            </div>
        )}
      </Modal.Body>
      {!isSuccess && (
          <Modal.Footer>
            <Button variant="ghost" onClick={onClose}>取消</Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!comment.trim()}>提交评价</Button>
          </Modal.Footer>
      )}
    </Modal.Root>
  );
};