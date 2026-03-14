import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleKakaoCallback, isKakaoLoginPending } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleKakaoCallback(code);
    }
  }, [searchParams, handleKakaoCallback]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <p className='text-purple-black/50'>
        {isKakaoLoginPending ? '카카오 로그인 처리 중...' : '잠시만 기다려주세요...'}
      </p>
    </div>
  );
};

export default KakaoCallback;
