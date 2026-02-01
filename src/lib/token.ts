// 简单的内存存储，用于存放 Access Token
// 避免将 Access Token 存放在 localStorage 中以防止 XSS 攻击

let accessToken = '';

export const getAccessToken = (): string => {
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = '';
};
