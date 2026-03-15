import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import LoginForm from '../components/LoginForm/LoginForm';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import RoomContainer from '../containers/RoomContainer/RoomContainer';
import type { RootState } from '../store';
import { setIsEditMode } from '../store/shelfSlice';

const Home = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  const scrollToMain = useCallback(() => {
    if (!mainRef.current) return;
    const top =
      mainRef.current.getBoundingClientRect().top + window.scrollY - 200;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(setIsEditMode(false));
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (location.state?.shouldScroll) {
      scrollToMain();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate, scrollToMain]);

  // 휠 살짝 돌리면 로그인 섹션으로 스냅 스크롤
  useEffect(() => {
    let scrolled = false;
    let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      // 이미 메인 섹션 영역에 있으면 무시
      if (window.scrollY > window.innerHeight * 0.5) return;
      // 아래로 스크롤할 때만
      if (e.deltaY <= 0) return;
      if (scrolled) return;

      scrolled = true;
      scrollToMain();

      // 연속 트리거 방지
      cooldownTimer = setTimeout(() => {
        scrolled = false;
      }, 1000);
    };

    // 타임아웃 클린업
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  }, [scrollToMain]);

  return (
    <div
      className={
        'mx-auto my-0 box-border flex w-full flex-col items-center justify-center'
      }
    >
      <Header />
      <section className={`bg-purple-black h-250 w-full`}>
        {/* 룸 이미지 섹션 (랜딩) */}
        <RoomContainer key={location.pathname} onStart={scrollToMain} />
      </section>

      {/* 메인 섹션 */}
      <main ref={mainRef} className={`mx-auto mt-15 max-w-7xl min-w-[70vw]`}>
        {isLoggedIn ? <ProfileCard /> : <LoginForm />}
      </main>
      <div className='h-[2000px]'></div>
    </div>
  );
};

export default Home;
