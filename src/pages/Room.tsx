import ProfileCard from '../components/ProfileCard/ProfileCard';
import CommentContainer from '../containers/CommentContainer/CommentContainer';
import RoomContainer from '../containers/RoomContainer/RoomContainer';
import RoomControlContainer from '../containers/RoomControlContainer/RoomControlContainer';

const Room = () => {
  return (
    <div
      className={
        'mx-auto my-0 box-border flex w-full flex-col items-center justify-center'
      }
    >
      <section className={`h-250 w-full`}>
        {/* 룸 이미지 섹션 */}
        <RoomContainer isHome={false} />
      </section>

      {/* 메인 섹션 */}
      <main
        className={`mx-auto flex max-w-7xl min-w-[70vw] flex-col flex-wrap gap-6 pt-6`}
      >
        <RoomControlContainer />
        <div className={`flex h-auto w-full flex-row gap-12`}>
          <ProfileCard />
          <CommentContainer />
        </div>
      </main>
    </div>
  );
};

export default Room;
