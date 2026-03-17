import { redirectToKakao } from '../../hooks/useAuth';

const LoginForm = () => {

  return (
    <div
      className={`bg-card-background flex w-full flex-col items-start gap-4 rounded-lg p-8 md:w-75`}
    >
      <p>👥 Login</p>
      <p className='text-purple-black/50 text-sm'>
        카카오 계정으로 간편하게 시작하세요.
      </p>
      <button
        type='button'
        onClick={redirectToKakao}
        className='flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FEE500] text-[#191919] transition-[filter] hover:brightness-95 active:brightness-90'
      >
        <svg
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9 0.6C4.029 0.6 0 3.713 0 7.55C0 9.94 1.558 12.048 3.931 13.296L2.933 16.944C2.845 17.262 3.213 17.514 3.489 17.324L7.873 14.403C8.242 14.44 8.617 14.46 9 14.46C13.971 14.46 18 11.347 18 7.51C18 3.673 13.971 0.6 9 0.6Z'
            fill='#191919'
          />
        </svg>
        카카오 로그인
      </button>
    </div>
  );
};

export default LoginForm;
