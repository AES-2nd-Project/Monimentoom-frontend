import Header from '../components/Header/Header';
import SignupForm from '../components/SignupForm/SignupForm';

const Signup = () => {
  return (
    <div className='flex h-screen w-full flex-col'>
      <Header />
      <main className='flex flex-1 items-center justify-center'>
        <SignupForm />
      </main>
    </div>
  );
};

export default Signup;
