import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import KakaoCallback from './pages/KakaoCallback';
import MyPage from './pages/MyPage';
import Room from './pages/Room';
import Signup from './pages/Signup';

// 닉네임이 바뀔 때 Room 전체를 리마운트 → 편집 모드·선택 상태 초기화 보장
const RoomPage = () => {
  const { nickname } = useParams<{ nickname: string }>();
  return <Room key={nickname} />;
};

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'));
  if (!isAuthenticated) {
    return <Navigate to='/' state={{ shouldScroll: true }} replace />;
  }
  return children;
};

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/rooms/:nickname' element={<RoomPage />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/oauth/kakao' element={<KakaoCallback />} />
            <Route
              path='/mypage'
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
