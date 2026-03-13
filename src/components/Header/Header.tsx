import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { useNavigateToLogin } from '../../hooks/useNavigateToLogin';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, nickname } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location.pathname === '/';
  const handleLoginClick = useNavigateToLogin();

  const handleRoomClick = () => {
    if (isLoggedIn && nickname) {
      const roomPath = `/rooms/${nickname}`;
      if (location.pathname === roomPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(roomPath);
      }
    } else {
      handleLoginClick();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isHome) {
        setIsScrolled(true);
        return;
      }

      if (window.scrollY >= 900) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, location.pathname]);

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
      <div className={`mx-auto flex w-full max-w-7xl items-center px-12`}>
        <AnimatePresence mode='wait'>
          {!isHome && (
            <motion.div
              key='logo'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={'/'}>
                <img src={logo} className={`h-20 w-auto`} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.nav layout className='flex flex-1 justify-center'>
          <ul
            className={`text-purple-white flex shrink-0 justify-between gap-40`}
          >
            <li
              onClick={handleRoomClick}
              className={`hover:text-point-pink cursor-pointer transition-colors`}
            >
              Room
            </li>
            <li
              className={`hover:text-point-pink cursor-pointer transition-colors`}
            >
              MyPage
            </li>
            <li
              onClick={isLoggedIn ? logout : handleLoginClick}
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
