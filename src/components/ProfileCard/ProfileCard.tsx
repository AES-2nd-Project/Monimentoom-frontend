import image from '../../assets/react.svg';

const ProfileCard = () => {
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
        <p className={`w-20 shrink-0 text-start`}>닉네임</p>
      </div>
    </div>
  );
};

export default ProfileCard;
