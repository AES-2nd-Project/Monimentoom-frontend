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

  // props가 없으면 내 정보 사용 (홈 페이지에서 조회되는 프로필)
  const displayNickname = ownerNickname ?? myNickname ?? '게스트';
  const displayImage = ownerProfileImageUrl ?? myProfileImageUrl ?? '/icon.png';
  const displayDescription = ownerDescription ?? myDescription ?? null;
  const isTruncated =
    !!displayDescription && displayDescription.length > MAX_LENGTH;
  // Room 페이지처럼 owner props가 내려온 경우엔 로그아웃 미노출
  // 홈 페이지처럼 props 없이 쓸 때만 노출
  const hasOwnerInfo =
    ownerNickname !== undefined ||
    ownerProfileImageUrl !== undefined ||
    ownerDescription !== undefined;
  const showLogout = !hasOwnerInfo;

  return (
    <div className='bg-card-background flex min-h-75 w-75 flex-col gap-8 rounded-lg p-8'>
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
