import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken, REFRESH_COOKIE_CONFIG } from '@/lib/jwt'
import { loginSchema, type LoginInput } from '@/lib/schemas'
import { success, error, withErrorHandler, withValidation } from '@/lib/response'

const handler = async (req: Request, body: LoginInput) => {
  // 查找用户
  const user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) {
    return error('邮箱或密码错误', 401, 401)
  }

  // 验证密码
  const valid = await bcrypt.compare(body.password, user.passwordHash)
  if (!valid) {
    return error('邮箱或密码错误', 401, 401)
  }

  // 签发 Token
  const access = await signAccessToken(user.id)
  const refresh = await signRefreshToken(user.id)

  const res = success(
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: access,
    },
    '登录成功',
  )
  res.cookies.set(REFRESH_COOKIE_CONFIG.name, refresh, REFRESH_COOKIE_CONFIG.options)
  return res
}

export const POST = withErrorHandler(withValidation(loginSchema, handler))
