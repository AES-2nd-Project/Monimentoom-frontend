import RoomButton from '../../components/RoomButton/RoomButton';

const RoomControlContainer = () => {
  const onClick = () => {
    return;
  };

  return (
    <div className={'grid w-full grid-cols-3 items-center'}>
      <div className={'flex justify-start'}>
        <RoomButton
          onClick={onClick}
          color='point-green'
          label='초록버튼'
          visibility={true}
        />
      </div>
      <div className={'flex justify-center'}>
        <RoomButton
          onClick={onClick}
          color='point-pink'
          label='Like'
          visibility={true}
        />
      </div>
      <div
        className={
          'bg-card-background flex w-fit flex-row gap-4 justify-self-end rounded-lg p-4'
        }
      >
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
