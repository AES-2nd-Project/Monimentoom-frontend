import axios, { type AxiosRequestHeaders } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');

    // OAuth 요청은 토큰 불필요
    const isAuthRoute = config.url?.includes('/oauth/kakao');

    if (token && !isAuthRoute) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      config.headers.Authorization = `Bearer ${token}`;
    }

    //  FormData면 Content-Type 제거해서 브라우저가 boundary 포함해 셋팅하도록
    if (config.data instanceof FormData) {
      // 대소문자 모두 방어
      delete config.headers?.['Content-Type'];
      delete config.headers?.['content-type'];
    }

    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;

let isHandlingAuthError = false;

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';

    // 로그인/회원가입/OAuth는 401을 화면에서 직접 처리
    const isAuthFlow =
      url.includes('/login') ||
      url.includes('/signup') ||
      url.includes('/oauth');

    if (status === 401 && !isAuthFlow && !isHandlingAuthError) {
      isHandlingAuthError = true;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');

      // dispatch 완료 후 이동
      Promise.all([import('../store'), import('../store/authSlice')])
        .then(([{ store }, { logout }]) => {
          store.dispatch(logout());
        })
        .finally(() => {
          window.location.href = '/';
          isHandlingAuthError = false;
        });
    }

    return Promise.reject(error);
  }
);
