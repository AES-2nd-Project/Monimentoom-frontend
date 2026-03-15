import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useKakaoLogin } from '../hooks/useAuth';

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleKakaoCallback, isKakaoLoginPending } = useKakaoLogin();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const error = searchParams.get('error');
    const code = searchParams.get('code');

    if (error || !code) {
      alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/');
      return;
    }

    handleKakaoCallback(code);
  }, [searchParams, handleKakaoCallback, navigate]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <p className='text-purple-black/50'>
        {isKakaoLoginPending ? '카카오 로그인 처리 중...' : '잠시만 기다려주세요...'}
      </p>
    </div>
  );
};

export default KakaoCallback;
