import { NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

// ── 统一响应格式 ──────────────────────────────

export interface ApiResponse<T = unknown> {
  code: number
  data: T | null
  message: string
}

// ── 工厂函数 ──────────────────────────────────

export function success<T>(data: T, message = 'ok', status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { code: status, data, message },
    { status },
  )
}

export function error(message: string, code = 500, status?: number) {
  return NextResponse.json<ApiResponse<null>>(
    { code, data: null, message },
    { status: status ?? code },
  )
}

// ── 错误处理包装器 ────────────────────────────

type RouteHandler<T extends unknown[] = []> = (
  req: Request,
  ...args: T
) => Promise<NextResponse>

export function withErrorHandler<T extends unknown[] = []>(
  handler: RouteHandler<T>,
): RouteHandler<T> {
  return async (req, ...args) => {
    try {
      return await handler(req, ...args)
    } catch (err) {
      if (err instanceof ZodError) {
        const msg = err.issues.map((i) => i.message).join('; ')
        return error(msg, 400, 400)
      }
      if (process.env.NODE_ENV !== 'production') {
        console.error('[API Error]', err)
      }
      return error('服务器内部错误', 500)
    }
  }
}

// ── Zod 校验中间件 ─────────────────────────────

export function withValidation<S extends ZodSchema>(
  schema: S,
  handler: (req: Request, body: S['_output']) => Promise<NextResponse>,
) {
  return async (req: Request) => {
    const raw = await req.json().catch(() => ({}))
    const body = schema.parse(raw)
    return handler(req, body)
  }
}
