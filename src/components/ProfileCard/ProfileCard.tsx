import { useState } from 'react';
import { useAuthState, useLogout } from '../../hooks/useAuth';

interface ProfileCardProps {
  // Room 페이지에서 방 주인 정보를 내려줄 때 사용
  ownerNickname?: string;
  ownerProfileImageUrl?: string | null;
  ownerDescription?: string | null;
}

const MAX_LENGTH = 50;

const ProfileCard = ({
  ownerNickname,
  ownerProfileImageUrl,
  ownerDescription,
}: ProfileCardProps) => {
  const {
    nickname: myNickname,
    profileImageUrl: myProfileImageUrl,
    description: myDescription,
  } = useAuthState();
  const { logout } = useLogout();
  const [expanded, setExpanded] = useState(false);

  // owner props가 하나라도 있으면 Room 페이지로 판단
  const hasOwnerInfo =
    ownerNickname !== undefined ||
    ownerProfileImageUrl !== undefined ||
    ownerDescription !== undefined;

  // Room 페이지: 방 주인 데이터만 사용 (null이어도 내 정보로 폴백 안 함)
  // 홈 페이지: 내 정보 사용
  const displayNickname = hasOwnerInfo
    ? (ownerNickname ?? '게스트')
    : (myNickname ?? '게스트');
  const displayImage = hasOwnerInfo
    ? (ownerProfileImageUrl ?? '/icon.png')
    : (myProfileImageUrl ?? '/icon.png');
  const displayDescription = hasOwnerInfo ? ownerDescription : myDescription;
  const isTruncated =
    !!displayDescription && displayDescription.length > MAX_LENGTH;
  const showLogout = !hasOwnerInfo;

  return (
    <div className='bg-card-background flex min-h-75 w-75 shrink-0 flex-col gap-8 rounded-lg p-8'>
      <div className='flex flex-row items-center justify-start gap-4 bg-transparent'>
        <img
          src={displayImage}
          className='bg-primary h-10 w-10 shrink-0 rounded-4xl object-cover'
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/icon.png';
          }}
        />
        <p className='w-20 shrink-0 text-start text-xl font-bold'>
          {displayNickname}
        </p>
      </div>

      {displayDescription ? (
        <div className='text-purple-black/70 text-sm'>
          <p>
            {isTruncated && !expanded
              ? `${displayDescription.slice(0, MAX_LENGTH)}…`
              : displayDescription}
          </p>
          {isTruncated && (
            <button
              type='button'
              onClick={() => setExpanded(prev => !prev)}
              className='text-purple-black/40 hover:text-purple-black/70 mt-1 cursor-pointer text-xs transition-colors'
            >
              {expanded ? '접기' : '더보기'}
            </button>
          )}
        </div>
      ) : (
        <p className='text-purple-black/30 text-sm'>한줄 소개가 없습니다.</p>
      )}

      {showLogout && (
        <button
          type='button'
          onClick={logout}
          className='bg-button text-purple-white mt-auto h-12 w-full rounded-lg'
        >
          로그아웃
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
