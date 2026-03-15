import defaultImage from '../../assets/react.svg';
import { useAuthState, useLogout } from '../../hooks/useAuth';

interface ProfileCardProps {
  // Room 페이지에서 방 주인 정보를 내려줄 때 사용
  ownerNickname?: string;
  ownerProfileImageUrl?: string | null;
  isMine?: boolean;
}

const ProfileCard = ({
  ownerNickname,
  ownerProfileImageUrl,
  isMine,
}: ProfileCardProps) => {
  const { nickname: myNickname } = useAuthState();
  const { logout } = useLogout();

  // props가 없으면 내 정보 사용 (홈 페이지에서 조회되는 프로필)
  const displayNickname = ownerNickname ?? myNickname ?? '게스트';
  const displayImage = ownerProfileImageUrl ?? defaultImage;
  const showLogout = isMine !== false;

  return (
    <div className='bg-card-background flex h-75 w-75 flex-col gap-4 rounded-lg p-8'>
      <div className='flex flex-row items-center justify-start gap-4 bg-transparent'>
        <img
          src={displayImage}
          className='bg-primary h-10 w-10 shrink-0 rounded-4xl object-cover'
        />
        <p className='w-20 shrink-0 text-start'>{displayNickname}</p>
      </div>

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
