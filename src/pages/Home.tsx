import LoginForm from '../components/LoginForm/LoginForm';
import RoomContainer from '../containers/RoomContainer/RoomContainer';

const Home = () => {
  return (
    <div
      className={
        'mx-auto my-0 box-border flex w-full flex-col items-center justify-center'
      }
    >
      <section className={`h-125 w-full`}>
        {/* 룸 이미지 섹션 */}
        <RoomContainer />
      </section>

      {/* 메인 섹션 */}
      <main className={`mx-auto max-w-7xl min-w-[70vw]`}>
        <LoginForm />
      </main>
    </div>
  );
};

export default Home;
