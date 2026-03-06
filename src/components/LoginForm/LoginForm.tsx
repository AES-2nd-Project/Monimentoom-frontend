const LoginForm = () => {
  return (
    <form
      className={`bg-card-background mt-15 flex h-75 w-75 flex-col gap-4 rounded-lg p-8`}
    >
      <p>👥 Login</p>
      <input
        type='text'
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='id'
      />
      <input
        type='password'
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='password'
      />
      <button
        type='submit'
        className={`bg-button mt-auto h-12 w-full rounded-lg`}
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
