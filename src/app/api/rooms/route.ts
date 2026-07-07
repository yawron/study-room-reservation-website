import { prisma } from '@/lib/prisma'
import { success, withErrorHandler } from '@/lib/response'

const VALID_TYPES = ['QUIET_POD', 'COLLAB_SUITE', 'WINDOW_SEAT', 'CONFERENCE']

export const GET = withErrorHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 10))

  const where: Record<string, unknown> = {}
  if (type && VALID_TYPES.includes(type)) {
    where.type = type
  }

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.room.count({ where }),
  ])

  return success({
    rooms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})
