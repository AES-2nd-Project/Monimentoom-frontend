import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isPending } = useAuth();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return alert('아이디와 비밀번호를 입력해주세요.');

    login({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-card-background flex h-75 w-75 flex-col gap-4 rounded-lg p-8`}
    >
      <p>👥 Login</p>
      <input
        type='text'
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='email'
      />
      <input
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='password'
      />
      <button
        type='submit'
        disabled={isPending}
        className={`bg-button text-purple-white hover:bg-hover active:bg-hover/70 mt-auto h-12 w-full rounded-lg transition-colors duration-200`}
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>
      <p
        className={`text-purple-black/50 hover:text-purple-black/80 text-center transition-colors duration-200`}
      >
        계정이 없나요?{' '}
        <Link to={'/signup'} className={`cursor-pointer underline`}>
          회원가입
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
