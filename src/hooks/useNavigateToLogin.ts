import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigateToLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 950, behavior: 'smooth' });
    } else {
      navigate('/', { state: { shouldScroll: true } });
    }
  };
};
