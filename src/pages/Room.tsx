import ProfileCard from '../components/ProfileCard/ProfileCard';
import RoomButton from '../components/RoomButton/RoomButton';
import RoomContainer from '../containers/RoomContainer/RoomContainer';

const Room = () => {
  const onClick = () => {
    return;
  };
  return (
    <div
      className={
        'mx-auto my-0 box-border flex w-full flex-col items-center justify-center'
      }
    >
      <section className={`h-125 w-full`}>
        {/* 룸 이미지 섹션 */}
        <RoomContainer isHome={false} />
      </section>

      {/* 메인 섹션 */}
      <main className={`mx-auto max-w-7xl min-w-[70vw]`}>
        <ProfileCard />
        <RoomButton onClick={onClick} color='point-green' label='초록버튼' />
        <RoomButton onClick={onClick} color='point-pink' label='핑크버튼' />
        <RoomButton onClick={onClick} color='button' label='버튼' />
      </main>
    </div>
  );
};

export default Room;
