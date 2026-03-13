import { useDispatch, useSelector } from 'react-redux';
import RoomButton from '../../components/RoomButton/RoomButton';
import type { RootState } from '../../store';
import { toggleIsEditMode } from '../../store/shelfSlice';

const RoomControlContainer = () => {
  const dispatch = useDispatch();

  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);

  const handleConfigClick = () => {
    dispatch(toggleIsEditMode());
  };

  const onClick = () => {
    return;
  };

  return (
    <div className={'grid w-full grid-cols-3 items-center px-25'}>
      <div className={'flex justify-start'}>
        {isEditMode ? (
          <RoomButton
            onClick={handleConfigClick}
            color='point-green'
            label='저장'
            visibility={true}
          />
        ) : (
          <RoomButton
            onClick={handleConfigClick}
            color='gray'
            label='편집'
            visibility={true}
          />
        )}
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
