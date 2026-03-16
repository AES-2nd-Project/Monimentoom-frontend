import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEaselPresignedUrl,
  sanitizeFileName,
  uploadToS3,
} from '../../api/s3-api';
import type { RootState } from '../../store';
import { setEaselImage } from '../../store/shelfSlice';

const RoomEasel = () => {
  const dispatch = useDispatch();
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const easelImageUrl = useSelector(
    (state: RootState) => state.shelf.easelImageUrl
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isEditMode && !isUploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { presignedUrl, imageUrl, contentType } =
        await getEaselPresignedUrl(sanitizeFileName(file.name));
      await uploadToS3(presignedUrl, file, contentType);
      dispatch(setEaselImage(imageUrl));
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div
      className={
        'absolute bottom-[10%] left-1/2 z-30 h-auto w-80 origin-bottom -translate-x-41.25'
      }
    >
      {/* 이젤 캔버스 영역 — 프레임보다 먼저 렌더링해서 뒤에 깔리게 */}
      <div
        className={clsx(
          'bg-purple-white absolute bottom-45.5 left-5 z-10 h-[41%] w-[89%] origin-bottom overflow-hidden',
          isEditMode && 'cursor-pointer',
          isEditMode &&
            !easelImageUrl &&
            'border-secondary/50 border-2 border-dashed'
        )}
        onMouseEnter={() => isEditMode && easelImageUrl && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {easelImageUrl ? (
          <>
            <img
              src={easelImageUrl}
              alt='이젤 이미지'
              className={clsx(
                'pointer-events-none h-full w-full object-contain transition-[filter]',
                isEditMode && 'hover:brightness-90'
              )}
              draggable={false}
            />
            {isEditMode && isHovered && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(setEaselImage(null));
                }}
                className='bg-point-pink text-purple-white hover:bg-point-pink/80 pointer-events-auto absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs shadow transition-colors'
              >
                ✕
              </button>
            )}
          </>
        ) : (
          isEditMode && (
            <span className='text-secondary/60 absolute inset-0 flex items-center justify-center text-xs select-none'>
              {isUploading ? '업로드 중...' : '클릭하여 이미지 등록'}
            </span>
          )
        )}
      </div>

      {/* 이젤 프레임 — 장식용, 클릭 이벤트 통과 */}
      <div
        className={`pointer-events-none relative z-20 aspect-1349/2010 w-full bg-[url('/src/assets/easel.png')] bg-cover bg-center bg-no-repeat`}
      />

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
};

export default RoomEasel;
