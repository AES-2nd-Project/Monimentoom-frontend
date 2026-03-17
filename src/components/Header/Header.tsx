import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRandomRoom } from '../../api/room-api';
import logo from '../../assets/logo.png';
import { useAuthState, useLogout } from '../../hooks/useAuth';
import { useNavigateToLogin } from '../../hooks/useNavigateToLogin';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, nickname } = useAuthState();
  const { logout } = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location.pathname === '/';
  const handleLoginClick = useNavigateToLogin();

  const handleRoomClick = async () => {
    // Redux nickname이 아직 없을 때 localStorage를 fallback으로 사용
    const resolvedNickname = nickname || localStorage.getItem('nickname');
    if (!isLoggedIn || !resolvedNickname) {
      // 게스트: 랜덤 유저의 방 방문
      try {
        const data = await getRandomRoom();
        if (data?.nickname) {
          navigate(`/rooms/${data.nickname}`);
        } else {
          handleLoginClick();
        }
      } catch {
        handleLoginClick();
      }
      return;
    }
    const roomPath = `/rooms/${resolvedNickname}`;
    if (location.pathname === roomPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(roomPath);
    }
  };

  const handleMyPageClick = () => {
    if (!isLoggedIn) return handleLoginClick();
    navigate('/mypage');
  };

  const handleAuthClick = () => {
    if (isLoggedIn) logout();
    else handleLoginClick();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') {
        setIsScrolled(true);
        return;
      }
      setIsScrolled(window.scrollY >= 900);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor:
          !isHome || isScrolled
            ? 'var(--color-third, #1a1a1a)'
            : 'rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.4 }}
      className='fixed top-0 left-0 z-50 flex h-20 w-full items-center'
    >
      <div className={`mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-1 px-4 md:flex-row md:gap-0 md:px-12`}>
        <AnimatePresence mode='wait'>
          {!isHome && (
            <motion.div
              key='logo'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className='flex items-center md:mr-auto'
            >
              <Link to={'/'}>
                <img src={logo} className={`h-9 w-auto md:h-20`} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.nav layout className='flex md:flex-1 justify-center'>
          <ul
            className={`text-purple-white flex shrink-0 justify-between gap-8 text-sm md:gap-40 md:text-base`}
          >
            <li
              onClick={handleRoomClick}
              className={`hover:text-point-pink cursor-pointer transition-colors`}
            >
              Room
            </li>
            <li
              onClick={handleMyPageClick}
              className={`hover:text-point-pink cursor-pointer transition-colors`}
            >
              MyPage
            </li>
            <li
              onClick={handleAuthClick}
              className={`hover:text-point-pink cursor-pointer transition-colors`}
            >
              {isLoggedIn ? `로그아웃` : `로그인`}
            </li>
          </ul>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;
