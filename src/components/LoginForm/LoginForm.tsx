import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/users-api';
import { setLoggedIn } from '../../store/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: data => {
      localStorage.setItem('accessToken', data.accessToken);
      dispatch(setLoggedIn(true));
      navigate('/');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return alert('아이디와 비밀번호를 입력해주세요.');

    mutate({ email, password });
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
        className={`bg-button mt-auto h-12 w-full rounded-lg`}
      >
        {isPending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};

export default LoginForm;
