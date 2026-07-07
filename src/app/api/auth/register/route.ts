import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken, REFRESH_COOKIE_CONFIG } from '@/lib/jwt'
import { registerSchema, type RegisterInput } from '@/lib/schemas'
import { success, error, withErrorHandler, withValidation } from '@/lib/response'

const handler = async (req: Request, body: RegisterInput) => {
  // 检查邮箱是否已注册
  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) {
    return error('该邮箱已注册', 409, 409)
  }

  // 密码哈希
  const passwordHash = await bcrypt.hash(body.password, 10)

  // 写入数据库
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  // 签发 Token
  const access = await signAccessToken(user.id)
  const refresh = await signRefreshToken(user.id)

  const res = success({ user, token: access }, '注册成功')
  res.cookies.set(REFRESH_COOKIE_CONFIG.name, refresh, REFRESH_COOKIE_CONFIG.options)
  return res
}

export const POST = withErrorHandler(withValidation(registerSchema, handler))
