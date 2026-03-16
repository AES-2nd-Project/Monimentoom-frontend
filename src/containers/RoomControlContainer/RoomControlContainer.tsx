import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteLike, postLike } from '../../api/like-api';
import { getRandomRoom, getRoomMain } from '../../api/room-api';
import RoomButton from '../../components/RoomButton/RoomButton';
import type { RootState } from '../../store';
import { toggleIsEditMode } from '../../store/shelfSlice';

interface RoomControlContainerProps {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
}

const RoomControlContainer = ({
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
  commentCount,
}: RoomControlContainerProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickname: urlNickname } = useParams<{ nickname: string }>();
  const authNickname = useSelector((state: RootState) => state.auth.nickname);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const roomId = useSelector((state: RootState) => state.shelf.roomId);

  const isMine = !urlNickname || urlNickname === authNickname;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchNickname, setSearchNickname] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [liked, setLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLiked(initialIsLiked);
    setCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchNickname.trim();
    if (!trimmed || isSearchLoading) return;
    setSearchError(false);
    setIsSearchLoading(true);
    try {
      await getRoomMain(trimmed);
      setIsSearchOpen(false);
      setSearchNickname('');
      navigate(`/rooms/${trimmed}`);
    } catch {
      setSearchError(true);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleRandomMove = async () => {
    setIsRandomLoading(true);
    try {
      const room = await getRandomRoom();
      if (room.nickname) navigate(`/rooms/${room.nickname}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRandomLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (roomId == null || likeLoading) return;
    setLikeLoading(true);

    // 낙관적 업데이트: 즉시 UI 반영
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = prevLiked ? await deleteLike(roomId) : await postLike(roomId);
      setLiked(res.isLiked);
      setCount(res.likeCount);
    } catch {
      // 실패 시 롤백
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className='grid w-full grid-cols-3 items-center px-25'>
      {/* 왼쪽: 편집/저장 */}
      <div className='flex justify-start'>
        {isMine &&
          (isEditMode ? (
            <RoomButton
              onClick={() => dispatch(toggleIsEditMode())}
              color='point-green'
              label='저장'
              visibility={true}
            />
          ) : (
            <RoomButton
              onClick={() => dispatch(toggleIsEditMode())}
              color='gray'
              label='편집'
              visibility={true}
            />
          ))}
      </div>

      {/* 가운데: 좋아요 + 댓글 수 */}
      <div className='flex items-center justify-center gap-6'>
        {/* 좋아요 */}
        <button
          onClick={handleLikeToggle}
          disabled={!isLoggedIn || likeLoading}
          aria-pressed={liked}
          className='flex cursor-pointer items-center gap-1.5 transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-40'
        >
          {liked ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='text-point-pink h-6 w-6'
            >
              <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='text-purple-black h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
              />
            </svg>
          )}
          <span className='text-purple-black text-sm font-medium'>{count}</span>
        </button>

        {/* 댓글 */}
        <div className='flex items-center gap-1.5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='text-purple-black h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z'
            />
          </svg>
          <span className='text-purple-black text-sm font-medium'>
            {commentCount}
          </span>
        </div>
      </div>

      {/* 오른쪽: 지정이동 / 랜덤이동 */}
      <div className='flex w-fit flex-row items-center gap-3 justify-self-end'>
        {isSearchOpen ? (
          <div className='relative'>
            <form
              onSubmit={handleSearchSubmit}
              className='flex items-center gap-2'
            >
              <input
                ref={inputRef}
                type='text'
                value={searchNickname}
                onChange={e => {
                  setSearchNickname(e.target.value);
                  setSearchError(false);
                }}
                onKeyDown={e => e.key === 'Escape' && setIsSearchOpen(false)}
                onBlur={() => {
                  if (!searchNickname.trim()) setIsSearchOpen(false);
                }}
                placeholder='닉네임 입력'
                className={`bg-purple-white text-purple-black w-32 rounded-lg px-3 py-2 text-sm ring-1 outline-none ${searchError ? 'ring-red-400' : 'ring-transparent'}`}
              />
              <button
                type='submit'
                disabled={!searchNickname.trim() || isSearchLoading}
                className='bg-button text-purple-white rounded-lg px-3 py-2 text-sm transition-[filter] hover:brightness-110 disabled:opacity-50'
              >
                {isSearchLoading ? '...' : '이동'}
              </button>
            </form>
            <span
              className={`absolute top-full left-0 mt-1 text-xs text-red-400 transition-opacity ${searchError ? 'opacity-100' : 'opacity-0'}`}
            >
              존재하지 않는 닉네임이에요
            </span>
          </div>
        ) : (
          <RoomButton
            onClick={handleSearchOpen}
            color='button'
            label='지정이동'
            visibility={true}
          />
        )}
        <RoomButton
          onClick={handleRandomMove}
          color={isRandomLoading ? 'gray' : 'button'}
          label={isRandomLoading ? '...' : '랜덤이동'}
          visibility={true}
        />
      </div>
    </div>
  );
};

export default RoomControlContainer;
