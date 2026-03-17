import { useAuthState, useLogout } from '../../hooks/useAuth';

interface ProfileCardProps {
  // Room 페이지에서 방 주인 정보를 내려줄 때 사용
  ownerNickname?: string;
  ownerProfileImageUrl?: string | null;
  ownerDescription?: string | null;
  isMine?: boolean;
}

const ProfileCard = ({
  ownerNickname,
  ownerProfileImageUrl,
  ownerDescription,
  isMine,
}: ProfileCardProps) => {
  const { nickname: myNickname, profileImageUrl: myProfileImageUrl, description: myDescription } =
    useAuthState();
  const { logout } = useLogout();

  // props가 없으면 내 정보 사용 (홈 페이지에서 조회되는 프로필)
  const displayNickname = ownerNickname ?? myNickname ?? '게스트';
  const displayImage = ownerProfileImageUrl ?? myProfileImageUrl ?? '/icon.png';
  const displayDescription = ownerDescription ?? myDescription ?? null;
  // 방 주인 정보가 내려온 경우(Room 페이지)엔 isMine === true일 때만 로그아웃 노출
  // 홈 페이지처럼 props 없이 쓸 때는 항상 노출
  const hasOwnerInfo =
    ownerNickname !== undefined || ownerProfileImageUrl !== undefined;
  const showLogout = hasOwnerInfo ? isMine === true : true;

  return (
    <div className='bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8'>
      <div className='flex flex-row items-center justify-start gap-4 bg-transparent'>
        <img
          src={displayImage}
          className='bg-primary h-10 w-10 shrink-0 rounded-4xl object-cover'
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/icon.png';
          }}
        />
        <p className='w-20 shrink-0 text-start font-medium'>{displayNickname}</p>
      </div>

      {displayDescription && (
        <p className='text-purple-black/60 line-clamp-2 text-sm'>
          {displayDescription}
        </p>
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
