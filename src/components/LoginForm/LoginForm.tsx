const LoginForm = () => {
  return (
    <form
      className={`bg-card-background mt-15 flex h-75 w-75 flex-col gap-4 rounded-[16px] p-8`}
    >
      <p>👥 로그인</p>
      <input type='text' className={`bg-purple-white rounded-md`} />
      <input type='password' className={`bg-purple-white rounded-md`} />
      <button></button>
    </form>
  );
};

export default LoginForm;
