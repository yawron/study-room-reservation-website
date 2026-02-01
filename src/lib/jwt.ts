import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// 工具函数生成密钥
const getSecret = () => new TextEncoder().encode(process.env.STARSTUDY_JWT_SECRET || 'dev-secret');

// 生成访问令牌 AT
export async function signAccessToken(userId: string) {
  return new SignJWT({ sub: userId, typ: 'access' }) 
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // 过期时间 15 分钟
    .sign(getSecret());
}

// 生成刷新令牌 RT
export async function signRefreshToken(userId: string) {
  return new SignJWT({ sub: userId, typ: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 过期时间 7 天
    .sign(getSecret());
}

// 验证令牌
export async function verifyToken<T extends JWTPayload = JWTPayload>(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
  return payload as T;
}

// 验证访问令牌 AT
export async function verifyAccess(token: string) {
  const payload = await verifyToken(token);
  if (payload.typ !== 'access') throw new Error('invalid token type');
  return payload;
}

// 验证刷新令牌 RT
export async function verifyRefresh(token: string) {
  const payload = await verifyToken(token);
  if (payload.typ !== 'refresh') throw new Error('invalid token type');
  return payload;
}
