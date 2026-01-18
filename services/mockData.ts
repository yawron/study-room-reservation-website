import { Room, RoomType, User } from '../types';

const USERS_STORAGE_KEY = 'starstudy_db_users';

export const INITIAL_USER: User = {
  id: 'u1',
  name: '陈同学',
  email: 'chen@university.edu',
  avatar: 'https://picsum.photos/200',
};

// Initialize DB if empty (Client side only)
if (typeof window !== 'undefined' && !localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([INITIAL_USER]));
}

export const getStoredUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const addUser = (userData: { name: string; email: string }): User => {
    const users = getStoredUsers();
    const newUser: User = {
        id: 'u' + (users.length + 1),
        name: userData.name,
        email: userData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
    };
    users.push(newUser);
    if (typeof window !== 'undefined') {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return newUser;
};

export const MOCK_USER = INITIAL_USER;

export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: '意式浓缩专注仓 A01',
    type: RoomType.QUIET_POD,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    description: '专为深度专注设计的舒适单人仓。配备隔音墙和温暖的氛围灯光，让您沉浸在学习心流中。',
    amenities: ['WiFi', '电源插座', '隔音'],
    isAvailable: true,
  },
  {
    id: '2',
    name: '派克市场协作间 B02',
    type: RoomType.COLLAB_SUITE,
    capacity: 4,
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    description: '非常适合小组项目讨论。配备白板、4K显示器和舒适的人体工学座椅。',
    amenities: ['WiFi', '白板', '4K 显示器', '空调'],
    isAvailable: true,
  },
  {
    id: '3',
    name: '花园景观休息区 C03',
    type: RoomType.WINDOW_SEAT,
    capacity: 2,
    pricePerHour: 5,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
    description: '自然光线充足的开放区域。最适合在欣赏风景的同时进行休闲阅读或复习。',
    amenities: ['WiFi', '自然光', '咖啡桌'],
    isAvailable: true,
  },
  {
    id: '4',
    name: '臻选会议大厅 D01',
    type: RoomType.CONFERENCE,
    capacity: 12,
    pricePerHour: 40,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: '行政风格的会议室，适合大型会议或研讨会。包含投影仪和会议电话系统。',
    amenities: ['WiFi', '投影仪', '会议电话', '餐饮服务'],
    isAvailable: false,
  },
  {
    id: '5',
    name: '烘焙工坊角落 E05',
    type: RoomType.QUIET_POD,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
    description: '位于安静角落的极简书桌空间。靠近咖啡吧台但保持足够的独立性，动静皆宜。',
    amenities: ['WiFi', '电源插座', '阅读灯'],
    isAvailable: true,
  },
  {
    id: '6',
    name: '露台长桌 F06',
    type: RoomType.COLLAB_SUITE,
    capacity: 6,
    pricePerHour: 20,
    imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070&auto=format&fit=crop',
    description: '带有厚重实木长桌的开放式空间。非常适合创意头脑风暴会议。',
    amenities: ['WiFi', '超大长桌', '环境音'],
    isAvailable: true,
  },
  {
    id: '7',
    name: '深思实验室 A02',
    type: RoomType.QUIET_POD,
    capacity: 1,
    pricePerHour: 5,
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
    description: '配备双显示器和人体工学椅的高级单人工作站，专为编程和设计任务打造。',
    amenities: ['WiFi', '双显示器', '人体工学椅'],
    isAvailable: true,
  },
  {
    id: '8',
    name: '晨光阅读角 C04',
    type: RoomType.WINDOW_SEAT,
    capacity: 1,
    pricePerHour: 2,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
    description: '面朝东方的舒适沙发座，清晨阳光洒满桌面，开启活力满满的一天。',
    amenities: ['WiFi', '舒适沙发', '阅读灯'],
    isAvailable: true,
  },
  {
    id: '9',
    name: '头脑风暴室 B03',
    type: RoomType.COLLAB_SUITE,
    capacity: 5,
    pricePerHour: 18,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop',
    description: '色彩活泼的研讨空间，整面墙都是白板，激发团队无限创意。',
    amenities: ['WiFi', '全墙白板', '懒人沙发'],
    isAvailable: false,
  },
  {
    id: '10',
    name: '静谧图书馆角落 A03',
    type: RoomType.QUIET_POD,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop',
    description: '经典图书馆风格，深色木质书桌，绝对安静的复习环境。',
    amenities: ['WiFi', '电源插座', '静音地毯'],
    isAvailable: true,
  },
  {
    id: '11',
    name: '云端会议室 D02',
    type: RoomType.CONFERENCE,
    capacity: 8,
    pricePerHour: 30,
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    description: '视野开阔的高层会议室，配备远程视频会议系统。',
    amenities: ['WiFi', '视频会议系统', '智能电视'],
    isAvailable: true,
  },
  {
    id: '12',
    name: '绿植氧吧 C05',
    type: RoomType.WINDOW_SEAT,
    capacity: 2,
    pricePerHour: 8,
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop',
    description: '被绿植环绕的双人座位，空气清新，缓解视觉疲劳。',
    amenities: ['WiFi', '空气净化', '绿植'],
    isAvailable: true,
  },
  {
    id: '13',
    name: '深夜自习室 A04',
    type: RoomType.QUIET_POD,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
    description: '24小时开放区域，柔和的暖色调灯光陪伴您的每一次挑灯夜战。',
    amenities: ['WiFi', '护眼灯', '24H开放'],
    isAvailable: true,
  },
  {
    id: '14',
    name: '创客工坊 B04',
    type: RoomType.COLLAB_SUITE,
    capacity: 6,
    pricePerHour: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop',
    description: '工业风设计，宽敞的工作台，适合需要动手操作或铺开图纸的团队。',
    amenities: ['WiFi', '宽大工作台', '工具箱'],
    isAvailable: true,
  }
];