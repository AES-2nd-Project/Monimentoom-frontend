import image from '../../assets/react.svg';
import { useAuthState, useLogout } from '../../hooks/useAuth';

const ProfileCard = () => {
  const { nickname } = useAuthState();
  const { logout } = useLogout();
  return (
    <div
      className={`bg-card-background flex h-75 w-75 flex-col gap-4 rounded-lg p-8`}
    >
      <div
        className={`flex flex-row items-center justify-start gap-4 bg-transparent`}
      >
        <img
          src={image}
          className={`bg-primary h-10 w-10 shrink-0 rounded-4xl`}
        />
        <p className={`w-20 shrink-0 text-start`}>{nickname || '게스트'}</p>
      </div>

      <button
        type='button'
        onClick={logout}
        className={`bg-button text-purple-white mt-auto h-12 w-full rounded-lg`}
      >
        로그아웃
      </button>
    </div>
  );
};

export default ProfileCard;
