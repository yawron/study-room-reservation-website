import { MOCK_ROOMS } from './mockData';
import { Booking, Room, User, Review } from '../types';
import { request } from '../lib/request';
import { getUserBookingsAction, cancelBookingAction } from '@/app/actions/bookings';

// Initial Mock Reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    roomId: '1',
    userId: 'u99',
    userName: '张同学',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
    rating: 5,
    comment: '非常安静，隔音效果很好，效率很高！',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'r2',
    roomId: '1',
    userId: 'u98',
    userName: 'Lee',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lee',
    rating: 4,
    comment: '灯光很舒服，就是空调稍微有点冷。',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

class ApiService {
  private reviews: Review[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Load reviews
      const savedReviews = localStorage.getItem('starstudy_reviews');
      if (savedReviews) {
        this.reviews = JSON.parse(savedReviews);
      } else {
        this.reviews = INITIAL_REVIEWS;
        localStorage.setItem('starstudy_reviews', JSON.stringify(this.reviews));
      }
    }
  }

  // 使用封装好的 Request Layer
  async login(email: string): Promise<{ user: User; token: string }> {
    return request.post('/auth/login', { email });
  }

  async register(name: string, email: string): Promise<{ user: User; token: string }> {
    return request.post('/auth/register', { name, email });
  }

  async logout(): Promise<void> {
    return request.post('/auth/logout');
  }

  // 获取当前用户信息 (用于初始化 Session)
  async getProfile(config?: { skipRedirect?: boolean }): Promise<User> {
    return request.get<User>('/auth/me', config);
  }

  async getRooms(category?: string): Promise<Room[]> {
    // 模拟调用
    const allRooms = await request.get<Room[]>('/rooms');
    if (!category || category === 'All') return allRooms;
    return allRooms.filter(r => r.type === category);
  }

  async getRoomById(id: string): Promise<Room | undefined> {
    // 模拟获取单个房间详情
    await new Promise(resolve => setTimeout(resolve, 300)); // 模拟一点延迟
    const allRooms = await request.get<Room[]>('/rooms');
    return allRooms.find(r => r.id === id);
  }

  // --- Reviews ---
  async getRoomReviews(roomId: string): Promise<Review[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.reviews.filter(r => r.roomId === roomId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    this.reviews = [newReview, ...this.reviews];
    if (typeof window !== 'undefined') {
        localStorage.setItem('starstudy_reviews', JSON.stringify(this.reviews));
    }
    return newReview;
  }

  // --- Bookings ---
  // 已重构为 Server Action，此处保留方法签名但委托给 Action 处理

  async getUserBookings(userId: string): Promise<Booking[]> {
    // 调用 Server Action 获取预订列表 (从 Cookie/Server)
    return getUserBookingsAction(userId);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    // 调用 Server Action 取消预订
    return cancelBookingAction(bookingId);
  }

  private saveToStorage() {
    // Reviews still use local storage for now
    if (typeof window !== 'undefined') {
        // localStorage.setItem('starstudy_bookings', JSON.stringify(this.bookings)); // Deprecated
    }
  }
}

export const api = new ApiService();
