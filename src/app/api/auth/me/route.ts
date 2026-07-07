import { verifyAccess } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { error, success, withErrorHandler } from '@/lib/response'

export const GET = withErrorHandler(async (req: Request) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error('未授权', 401, 401)
  }

  const token = authHeader.split(' ')[1]
  const payload = await verifyAccess(token)
  const userId = payload.sub as string

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  if (!user) {
    return error('用户不存在', 404, 404)
  }

  return success(user, '获取成功')
})
