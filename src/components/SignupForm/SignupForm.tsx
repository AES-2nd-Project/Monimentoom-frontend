import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const signupToken = (location.state as { signupToken?: string })?.signupToken;

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const { kakaoSignup, isKakaoSignupPending } = useAuth();

  // signupToken이 없으면 잘못된 접근
  if (!signupToken) {
    return (
      <div className='bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8'>
        <p className='text-purple-black/50 text-center'>
          잘못된 접근입니다. 카카오 로그인을 먼저 진행해주세요.
        </p>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='bg-button text-purple-white hover:bg-hover active:bg-hover/70 h-12 w-full rounded-lg transition-colors duration-200'
        >
          홈으로
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !nickname) {
      return alert('모든 항목을 입력해주세요.');
    }
    kakaoSignup({ signupToken, nickname, email });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8'
    >
      <p>👤 회원가입</p>
      <p className='text-purple-black/50 text-sm'>
        카카오 인증 완료! 닉네임과 이메일을 입력해주세요.
      </p>
      <input
        type='text'
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        className='bg-purple-white h-10 rounded-lg px-4'
        placeholder='닉네임'
      />
      <input
        type='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className='bg-purple-white h-10 rounded-lg px-4'
        placeholder='이메일'
      />
      <button
        type='submit'
        disabled={isKakaoSignupPending}
        className='bg-button text-purple-white hover:bg-hover active:bg-hover/70 mt-auto h-12 w-full rounded-lg transition-colors duration-200'
      >
        {isKakaoSignupPending ? '가입 중...' : '가입 완료'}
      </button>
    </form>
  );
};

export default SignupForm;
