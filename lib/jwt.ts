import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.STARSTUDY_JWT_SECRET || 'dev-secret');

export async function signAccessToken(userId: string) {
  return new SignJWT({ sub: userId, typ: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecret());
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({ sub: userId, typ: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken<T extends JWTPayload = JWTPayload>(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
  return payload as T;
}

export async function verifyAccess(token: string) {
  const payload = await verifyToken(token);
  if (payload.typ !== 'access') throw new Error('invalid token type');
  return payload;
}

export async function verifyRefresh(token: string) {
  const payload = await verifyToken(token);
  if (payload.typ !== 'refresh') throw new Error('invalid token type');
  return payload;
}
