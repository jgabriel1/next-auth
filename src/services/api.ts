import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['@nextauth:token']}`,
  },
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();

        const { '@nextauth:refreshToken': refreshToken } = cookies;

        const { data: refreshResponseData } = await api.post('refresh', {
          refreshToken,
        });

        const {
          token: newToken,
          refreshToken: newRefreshToken,
        } = refreshResponseData;

        setCookie(undefined, '@nextauth:token', newToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        setCookie(undefined, '@nextauth:refreshToken', newRefreshToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
      } else {
        // deslogar usuário
      }
    }
  }
);
