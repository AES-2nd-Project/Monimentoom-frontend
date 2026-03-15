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

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 401에러 뜨면 로그아웃하고 홈으로 보내기
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      import('../store').then(({ store }) => {
        import('../store/authSlice').then(({ logout }) => {
          store.dispatch(logout());
        });
      });
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
