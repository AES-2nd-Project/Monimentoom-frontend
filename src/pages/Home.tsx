import { useEffect } from 'react';
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

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(setIsEditMode(false));
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (location.state?.shouldScroll) {
      window.scrollTo({ top: 950, behavior: 'smooth' });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return (
    <div
      className={
        'mx-auto my-0 box-border flex w-full flex-col items-center justify-center'
      }
    >
      <Header />
      <section className={`bg-purple-black h-250 w-full`}>
        {/* 룸 이미지 섹션 */}
        <RoomContainer key={location.pathname} />
      </section>

      {/* 메인 섹션 */}
      <main className={`mx-auto mt-15 max-w-7xl min-w-[70vw]`}>
        {isLoggedIn ? <ProfileCard /> : <LoginForm />}
      </main>
      <div className='h-[2000px]'></div>
    </div>
  );
};

export default Home;
