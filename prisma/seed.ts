import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { RoomType } from '../generated/prisma/enums'

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
})

const rooms = [
  {
    name: '图书馆安静自习舱 A01',
    type: 'QUIET_POD' as RoomType,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    description: '图书馆内的单人安静舱，环境稳定、干扰少，适合长时间专注自习。',
    amenities: ['WiFi', '电源插座', '隔音墙'],
    isAvailable: true,
  },
  {
    name: '信息楼研讨室 B02',
    type: 'COLLAB_SUITE' as RoomType,
    capacity: 4,
    pricePerHour: 10,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    description: '教学楼内的小组研讨空间，适合课程讨论与项目推进。',
    amenities: ['WiFi', '白板', '投屏显示器', '空调'],
    isAvailable: true,
  },
  {
    name: '图书馆窗边阅读位 C03',
    type: 'WINDOW_SEAT' as RoomType,
    capacity: 2,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
    description: '自然光充足的双人阅读位，适合轻量复习与阅读。',
    amenities: ['WiFi', '自然光', '阅读灯'],
    isAvailable: true,
  },
  {
    name: '行政楼报告厅 D01',
    type: 'CONFERENCE' as RoomType,
    capacity: 12,
    pricePerHour: 20,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: '适合课程分享与大型研讨活动，配备投影与扩声设备。',
    amenities: ['WiFi', '投影仪', '扩声系统', '讲台'],
    isAvailable: false,
  },
  {
    name: '第二教学楼安静角 E05',
    type: 'QUIET_POD' as RoomType,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
    description: '教学楼内的独立学习位，安静稳定，适合课间自习与专注学习。',
    amenities: ['WiFi', '电源插座', '阅读灯'],
    isAvailable: true,
  },
  {
    name: '公共自习区长桌 F06',
    type: 'COLLAB_SUITE' as RoomType,
    capacity: 6,
    pricePerHour: 5,
    imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=2070&auto=format&fit=crop',
    description: '开放式公共自习长桌，适合小组作业与课程讨论。',
    amenities: ['WiFi', '长桌', '插座排'],
    isAvailable: true,
  },
  {
    name: '计算机楼单人自习位 A02',
    type: 'QUIET_POD' as RoomType,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
    description: '适合编程与自习的单人座位，配置稳定网络与舒适座椅。',
    amenities: ['WiFi', '人体工学椅', '电源插座'],
    isAvailable: true,
  },
  {
    name: '晨读区 C04',
    type: 'WINDOW_SEAT' as RoomType,
    capacity: 1,
    pricePerHour: 2,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
    description: '清晨光照充足的阅读位，适合背诵与早读。',
    amenities: ['WiFi', '阅读灯', '自然光'],
    isAvailable: true,
  },
  {
    name: '教学楼研讨室 B03',
    type: 'COLLAB_SUITE' as RoomType,
    capacity: 5,
    pricePerHour: 8,
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop',
    description: '适合课程汇报排练与小组讨论，支持白板记录与投屏。',
    amenities: ['WiFi', '白板墙', '投屏'],
    isAvailable: false,
  },
  {
    name: '图书馆深度自习位 A03',
    type: 'QUIET_POD' as RoomType,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop',
    description: '图书馆内的安静角落，适合冲刺复习与安静阅读。',
    amenities: ['WiFi', '电源插座', '静音区'],
    isAvailable: true,
  },
  {
    name: '创新中心会议室 D02',
    type: 'CONFERENCE' as RoomType,
    capacity: 8,
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    description: '适合社团例会与项目评审，支持远程会议与投屏。',
    amenities: ['WiFi', '视频会议系统', '投屏设备'],
    isAvailable: true,
  },
  {
    name: '绿植阅读区 C05',
    type: 'WINDOW_SEAT' as RoomType,
    capacity: 2,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop',
    description: '图书馆内的绿植阅读区，氛围舒适，适合轻阅读。',
    amenities: ['WiFi', '绿植', '自然光'],
    isAvailable: true,
  },
  {
    name: '24小时自习室 A04',
    type: 'QUIET_POD' as RoomType,
    capacity: 1,
    pricePerHour: 0,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
    description: '全天开放的安静自习室，适合晚自习与夜间备考。',
    amenities: ['WiFi', '护眼灯', '24小时开放'],
    isAvailable: true,
  },
  {
    name: '创客中心协作间 B04',
    type: 'COLLAB_SUITE' as RoomType,
    capacity: 6,
    pricePerHour: 12,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop',
    description: '适合设计作业与课程项目协作，桌面宽敞可摆放资料。',
    amenities: ['WiFi', '大工作台', '电源插座'],
    isAvailable: true,
  },
]

async function main() {
  console.log('Seeding rooms...')

  for (const room of rooms) {
    await prisma.room.create({ data: room })
  }

  console.log(`Seeded ${rooms.length} rooms.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
