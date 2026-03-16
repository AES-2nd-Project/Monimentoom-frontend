import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRoomDetail, type RoomDetailResponse } from '../api/room-api';
import Header from '../components/Header/Header';
import Inventory from '../components/Inventory/Inventory';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import CommentContainer from '../containers/CommentContainer/CommentContainer';
import RoomContainer from '../containers/RoomContainer/RoomContainer';
import RoomControlContainer from '../containers/RoomControlContainer/RoomControlContainer';
import type { RootState } from '../store';

const Room = () => {
  const roomId = useSelector((state: RootState) => state.shelf.roomId);
  const [roomDetail, setRoomDetail] = useState<RoomDetailResponse | null>(null);

  useEffect(() => {
    if (roomId == null) return;
    getRoomDetail(roomId).then(setRoomDetail).catch(console.error);
  }, [roomId]);

  return (
    <div className='mx-auto my-0 box-border flex w-full flex-col items-center justify-center gap-6 pt-20'>
      <Header />
      <section className='bg-purple-black h-250 w-full'>
        <RoomContainer />
      </section>

      <main className='mx-auto flex max-w-7xl min-w-[70vw] flex-col flex-wrap'>
        <RoomControlContainer
          isLiked={roomDetail?.isLiked ?? false}
          likeCount={roomDetail?.likeCount ?? 0}
          commentCount={roomDetail?.commentCount ?? 0}
        />
        <Inventory />
        <div className='flex h-auto w-full flex-row gap-12 pt-6'>
          <ProfileCard
            ownerNickname={roomDetail?.nickname}
            ownerProfileImageUrl={roomDetail?.userProfileImageUrl}
            isMine={roomDetail?.isMine}
          />
          <CommentContainer initialComments={roomDetail?.comments ?? []} />
        </div>
      </main>
    </div>
  );
};

export default Room;
