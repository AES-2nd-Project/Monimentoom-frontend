import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location.pathname === '/';
  const menus = ['Room', 'MyPage'];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        `fixed top-0 left-0 z-50 flex h-20 w-full items-center transition-colors duration-300`,
        !isHome || isScrolled ? 'bg-third' : 'bg-transparent'
      )}
    >
      <div className='mx-auto flex w-full max-w-7xl items-center px-12'>
        {!isHome && (
          <Link to={'/'} className='h-20 shrink-0'>
            <img src={logo} className='h-full w-auto' />
          </Link>
        )}

        <nav className={`flex flex-1 justify-center`}>
          <ul
            className={`text-purple-white flex shrink-0 justify-between gap-40`}
          >
            {menus.map(menu => (
              <li
                key={menu}
                className={`hover:text-point-pink cursor-pointer transition-colors duration-300`}
              >
                {menu}
              </li>
            ))}
            <li
              onClick={isLoggedIn ? logout : () => navigate('/')}
              className={`hover:text-point-pink cursor-pointer transition-colors duration-300`}
            >
              {isLoggedIn ? `로그아웃` : `로그인`}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
