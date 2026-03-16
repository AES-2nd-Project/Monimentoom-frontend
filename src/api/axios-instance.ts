import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키(refreshToken) 자동 전송
});

// ── request 인터셉터 ──────────────────────────────────────
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');

    // OAuth 요청은 토큰 불필요
    const isAuthRoute = config.url?.includes('/oauth/kakao');

    if (token && !isAuthRoute) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData면 Content-Type 제거해서 브라우저가 boundary 포함해 셋팅하도록
    if (config.data instanceof FormData) {
      delete config.headers?.['Content-Type'];
      delete config.headers?.['content-type'];
    }

    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;

// ── response 인터셉터 (silent refresh) ────────────────────
let refreshPromise: Promise<string> | null = null;

/**
 * 진행 중인 refresh가 있으면 재사용, 없으면 새로 시작.
 * 동시에 여러 401이 터져도 서버에는 1회만 요청.
 */
const getNewAccessToken = (): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios
    .post<{ token: string }>(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
      null,
      { withCredentials: true }
    )
    .then(res => res.data.token)
    .then(token => {
      localStorage.setItem('accessToken', token);
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/** localStorage + Redux 전부 초기화 후 홈으로 이동 */
const forceLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('nickname');
  localStorage.removeItem('profileImageUrl');

  Promise.all([import('../store'), import('../store/authSlice')])
    .then(([{ store }, { logout }]) => {
      store.dispatch(logout());
    })
    .finally(() => {
      window.location.href = '/';
    });
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original: AxiosRequestConfig & { _retry?: boolean } =
      error.config ?? {};
    const status = error.response?.status;
    const url: string = original.url ?? '';

    // 로그인/회원가입/OAuth/refresh 는 여기서 처리하지 않음
    const isAuthFlow =
      url.includes('/login') ||
      url.includes('/signup') ||
      url.includes('/oauth') ||
      url.includes('/auth/refresh');

    if (status === 401 && !isAuthFlow && !original._retry) {
      original._retry = true;
      try {
        const newToken = await getNewAccessToken();
        if (!original.headers) original.headers = {} as AxiosRequestHeaders;
        (original.headers as Record<string, string>).Authorization =
          `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
