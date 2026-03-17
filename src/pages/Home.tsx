import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import LoginForm from '../components/LoginForm/LoginForm';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import ShowcaseCarousel from '../components/ShowcaseCarousel/ShowcaseCarousel';
import RoomContainer from '../containers/RoomContainer/RoomContainer';
import type { RootState } from '../store';
import { setIsEditMode } from '../store/shelfSlice';

const Home = () => {
  const { isLoggedIn, nickname } = useSelector(
    (state: RootState) => state.auth
  );
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

  const handleStart = useCallback(() => {
    if (isLoggedIn && nickname) {
      navigate(`/rooms/${nickname}`);
    } else {
      scrollToMain();
    }
  }, [isLoggedIn, nickname, navigate, scrollToMain]);

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
      <section className={`bg-purple-black w-full`}>
        {/* 룸 이미지 섹션 (랜딩) */}
        <RoomContainer key={location.pathname} onStart={handleStart} />
      </section>

      {/* 메인 섹션 */}
      <main
        ref={mainRef}
        className={`mx-auto mt-15 w-full max-w-7xl px-4 md:px-12`}
      >
        <div className='flex flex-col items-center gap-8 md:flex-row md:items-start'>
          <div className='flex w-full shrink-0 justify-center md:w-auto md:justify-start'>
            {isLoggedIn ? <ProfileCard /> : <LoginForm />}
          </div>
          <div className='w-full min-w-0'>
            <ShowcaseCarousel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
