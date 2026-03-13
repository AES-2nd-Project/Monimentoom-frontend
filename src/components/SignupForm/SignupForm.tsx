import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { signup, isSignupPending } = useAuth();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !nickname || !password || !passwordConfirm) {
      return alert('모든 항목을 입력해주세요.');
    }
    if (password !== passwordConfirm) {
      return alert('비밀번호가 일치하지 않습니다.');
    }
    signup({ email, nickname, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8`}
    >
      <p>👤 회원가입</p>
      <input
        type='text'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='이메일'
      />
      <input
        type='text'
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='닉네임'
      />
      <input
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='비밀번호'
      />
      <input
        type='password'
        value={passwordConfirm}
        onChange={e => setPasswordConfirm(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='비밀번호 확인'
      />
      <button
        type='submit'
        disabled={isSignupPending}
        className={`bg-button text-purple-white hover:bg-hover active:bg-hover/70 mt-auto h-12 w-full rounded-lg transition-colors duration-200`}
      >
        {isSignupPending ? '가입 중...' : '회원가입'}
      </button>
      <p
        className={`text-purple-black/50 hover:text-purple-black/80 text-center transition-colors duration-200`}
      >
        이미 계정이 있나요?{' '}
        <Link to='/' state={{ shouldScroll: true }} className={`cursor-pointer underline`}>
          로그인
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
