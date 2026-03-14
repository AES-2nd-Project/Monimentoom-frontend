import Header from '../components/Header/Header';
import MyPageForm from '../components/MyPageForm/MyPageForm';

const MyPage = () => {
  return (
    <div className='flex h-screen w-full flex-col'>
      <Header />
      <main className='flex flex-1 items-center justify-center'>
        <MyPageForm />
      </main>
    </div>
  );
};

export default MyPage;
