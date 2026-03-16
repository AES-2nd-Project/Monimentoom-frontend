import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getRandomRoom } from '../../api/room-api';
import RoomButton from '../../components/RoomButton/RoomButton';
import type { RootState } from '../../store';
import { toggleIsEditMode } from '../../store/shelfSlice';

const RoomControlContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nickname: urlNickname } = useParams<{ nickname: string }>();
  const authNickname = useSelector((state: RootState) => state.auth.nickname);
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);

  const isMine = !urlNickname || urlNickname === authNickname;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchNickname, setSearchNickname] = useState('');
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchNickname.trim();
    if (!trimmed) return;
    setIsSearchOpen(false);
    setSearchNickname('');
    navigate(`/rooms/${trimmed}`);
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

      {/* 가운데: Like */}
      <div className='flex justify-center'>
        <RoomButton
          onClick={() => {}}
          color='point-pink'
          label='Like'
          visibility={true}
        />
      </div>

      {/* 오른쪽: 지정이동 / 랜덤이동 */}
      <div className='bg-card-background flex w-fit flex-row items-center gap-4 justify-self-end rounded-lg p-4'>
        {isSearchOpen ? (
          <form
            onSubmit={handleSearchSubmit}
            className='flex items-center gap-2'
          >
            <input
              ref={inputRef}
              type='text'
              value={searchNickname}
              onChange={e => setSearchNickname(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setIsSearchOpen(false)}
              onBlur={() => {
                if (!searchNickname.trim()) setIsSearchOpen(false);
              }}
              placeholder='닉네임 입력'
              className='bg-purple-white text-purple-black w-32 rounded-lg px-3 py-2 text-sm'
            />
            <button
              type='submit'
              disabled={!searchNickname.trim()}
              className='bg-button text-purple-white rounded-lg px-3 py-2 text-sm transition-[filter] hover:brightness-110 disabled:opacity-50'
            >
              이동
            </button>
          </form>
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
