
export enum RoomType {
  QUIET_POD = '静音专注仓',
  COLLAB_SUITE = '协作研讨室',
  WINDOW_SEAT = '景观座位',
  CONFERENCE = '会议室'
}

export interface Amenity {
  icon: string;
  label: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  date: string; // ISO String
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  status: 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  imageUrl: string;
}

export interface Review {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
