import { cookies } from 'next/headers';
import { verifyRefresh, REFRESH_COOKIE_CONFIG } from './jwt';

export async function getAuthenticatedUser(): Promise<string> {
  const cookieStore = cookies();
  const token = cookieStore.get(REFRESH_COOKIE_CONFIG.name)?.value;

  if (!token) {
    throw new Error('用户未登录，请先登录');
  }

  try {
    const payload = await verifyRefresh(token);
    if (!payload.sub) {
       throw new Error('无效的用户凭证');
    }
    return payload.sub as string;
  } catch (error) {
    throw new Error('认证失效，请重新登录');
  }
}
