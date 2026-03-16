import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFramePresignedUrl,
  sanitizeFileName,
  uploadToS3,
} from '../../api/s3-api';
import type { RootState } from '../../store';
import { setFrameImage } from '../../store/shelfSlice';

const RoomFrame = () => {
  const dispatch = useDispatch();
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const frameImageUrl = useSelector(
    (state: RootState) => state.shelf.frameImageUrl
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
        await getFramePresignedUrl(sanitizeFileName(file.name));
      await uploadToS3(presignedUrl, file, contentType);
      dispatch(setFrameImage(imageUrl));
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
      className={clsx(
        'absolute bottom-[68%] left-1/2 z-20 aspect-1766/1703 w-70',
        'origin-right -translate-x-[calc(100%+20px)] -skew-y-[13.8deg]'
      )}
    >
      {/* 액자 프레임 */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-[url('/src/assets/frame.png')] bg-cover bg-no-repeat`}
      />

      {/* 액자 내부 */}
      <div
        className={clsx(
          'bg-purple-white absolute top-23 left-5 z-10 flex h-[59%] w-[87%] origin-right items-center justify-center overflow-hidden transition-[filter]',
          isEditMode && 'cursor-pointer hover:brightness-90',
          isEditMode &&
            !frameImageUrl &&
            'border-secondary/50 border-2 border-dashed'
        )}
        onMouseEnter={() => isEditMode && frameImageUrl && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {frameImageUrl ? (
          <>
            <img
              src={frameImageUrl}
              alt='액자 이미지'
              className='pointer-events-none h-full w-full object-contain'
              draggable={false}
            />
            {isEditMode && isHovered && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  dispatch(setFrameImage(null));
                }}
                className={`bg-point-pink text-purple-white hover:bg-point-pink/80 pointer-events-auto absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs shadow transition-colors`}
              >
                ✕
              </button>
            )}
          </>
        ) : (
          isEditMode && (
            <span className='text-secondary/60 text-xs select-none'>
              {isUploading ? '업로드 중...' : '클릭하여 이미지 등록'}
            </span>
          )
        )}
      </div>

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

export default RoomFrame;
