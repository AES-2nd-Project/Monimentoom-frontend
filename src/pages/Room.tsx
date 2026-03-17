import { useRef, useState } from 'react';
import { getRoomDetail } from '../api/room-api';
import Header from '../components/Header/Header';
import Inventory from '../components/Inventory/Inventory';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import CommentContainer from '../containers/CommentContainer/CommentContainer';
import RoomContainer from '../containers/RoomContainer/RoomContainer';
import RoomControlContainer from '../containers/RoomControlContainer/RoomControlContainer';
import type { RoomDetailResponse } from '../types/room';

const Room = () => {
  const [roomDetail, setRoomDetail] = useState<RoomDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleRoomLoaded = (roomId: number) => {
    setIsLoading(true);
    setRoomDetail(null);
    getRoomDetail(roomId)
      .then(data => {
        setRoomDetail(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className='room-page-root mx-auto my-0 box-border flex w-full flex-col items-center justify-center gap-6 pt-20'>
      <Header />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/40 pt-20'>
          <div className='border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent' />
        </div>
      )}

      <section className='bg-purple-black w-full'>
        <RoomContainer onRoomLoaded={handleRoomLoaded} />
      </section>

      <main className='mx-auto flex w-full max-w-7xl flex-col flex-wrap px-4 md:px-12'>
        <RoomControlContainer
          isLiked={roomDetail?.isLiked ?? false}
          likeCount={roomDetail?.likeCount ?? 0}
          commentCount={roomDetail?.commentCount ?? 0}
          onCommentClick={() => {
            commentInputRef.current?.focus();
            commentInputRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }}
        />
        <Inventory />
        <div className='flex h-auto w-full flex-col items-center gap-12 pt-6 md:flex-row md:items-start'>
          <ProfileCard
            ownerNickname={roomDetail?.nickname}
            ownerProfileImageUrl={roomDetail?.userProfileImageUrl}
            ownerDescription={roomDetail?.userDescription}
          />
          <CommentContainer inputRef={commentInputRef} />
        </div>
      </main>
    </div>
  );
};

export default Room;
