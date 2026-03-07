import RoomButton from '../../components/RoomButton/RoomButton';

const RoomControlContainer = () => {
  const onClick = () => {
    return;
  };
  return (
    <div className={`flex w-full flex-row items-center justify-between`}>
      <RoomButton
        onClick={onClick}
        color='point-green'
        label='초록버튼'
        visibility={true}
      />
      <RoomButton
        onClick={onClick}
        color='point-pink'
        label='Like'
        visibility={true}
      />

      <div className={`bg-card-background flex flex-row gap-4 rounded-lg p-4`}>
        <RoomButton
          onClick={onClick}
          color='button'
          label='지정이동'
          visibility={true}
        />
        <RoomButton
          onClick={onClick}
          color='button'
          label='랜덤이동'
          visibility={true}
        />
      </div>
    </div>
  );
};

export default RoomControlContainer;
