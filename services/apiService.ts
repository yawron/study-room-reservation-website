import { MOCK_ROOMS } from './mockData';
import { Booking, Room, User, Review } from '../types';
import { request } from '../lib/request';

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
  private bookings: Booking[] = [];
  private reviews: Review[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Load bookings
      const savedBookings = localStorage.getItem('starstudy_bookings');
      if (savedBookings) {
        this.bookings = JSON.parse(savedBookings);
      }

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
  async createBooking(bookingData: Omit<Booking, 'id' | 'status'> & Partial<Pick<Booking, 'id' | 'status'>>): Promise<Booking> {
    // 模拟请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newBooking: Booking = {
      ...bookingData,
      id: bookingData.id ?? Math.random().toString(36).substr(2, 9),
      status: bookingData.status ?? 'confirmed'
    };
    
    this.bookings = [newBooking, ...this.bookings];
    this.saveToStorage();
    return newBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.bookings.filter(b => b.userId === userId);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.bookings = this.bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    );
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('starstudy_bookings', JSON.stringify(this.bookings));
    }
  }
}

export const api = new ApiService();
