import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Room from './pages/Room';
import Signup from './pages/Signup';

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
            <Route path='/rooms/:nickname' element={<Room />} />
            <Route path='/signup' element={<Signup />} />
            <Route
              path='/mypage'
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
