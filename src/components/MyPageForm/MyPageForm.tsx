import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProfilePresignedUrl,
  sanitizeFileName,
  uploadToS3,
} from '../../api/s3-api';
import { useAuthState, useProfileUpdate } from '../../hooks/useAuth';

const MyPageForm = () => {
  const navigate = useNavigate();
  const { nickname, profileImageUrl: currentProfileImageUrl } = useAuthState();
  const { updateProfile, isUpdateProfilePending } = useProfileUpdate();

  // 프로필 편집
  const [newNickname, setNewNickname] = useState(nickname);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    currentProfileImageUrl ?? undefined
  );
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentProfileImageUrl ?? undefined
  );
  const [isUploading, setIsUploading] = useState(false);

  // previewUrl이 blob URL로 바뀌거나 언마운트될 때만 해제
  useEffect(() => {
    if (!previewUrl?.startsWith('blob:')) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const { presignedUrl, imageUrl, contentType } =
        await getProfilePresignedUrl(sanitizeFileName(file.name));
      await uploadToS3(presignedUrl, file, contentType);
      setProfileImageUrl(imageUrl);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
      setPreviewUrl(undefined);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleUpdate = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newNickname) return alert('닉네임을 입력해주세요.');

    updateProfile({
      nickname: newNickname,
      profileImageUrl,
    });
  };

  return (
    <form
      onSubmit={handleUpdate}
      className='bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8'
    >
      <p>👤 프로필 편집</p>

      {/* 프로필 이미지 */}
      <div className='flex flex-col items-center gap-2'>
        <div
          className='bg-purple-white flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-[filter] hover:brightness-90'
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt='프로필'
              className='h-full w-full object-cover'
            />
          ) : (
            <span className='text-secondary/50 text-xs'>
              {isUploading ? '업로드 중...' : '이미지 변경'}
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleImageChange}
        />
      </div>

      {/* 닉네임 */}
      <input
        type='text'
        value={newNickname}
        onChange={e => setNewNickname(e.target.value)}
        className='bg-purple-white h-10 rounded-lg px-4'
        placeholder='닉네임'
      />

      <button
        type='submit'
        disabled={isUpdateProfilePending || isUploading}
        className='bg-button text-purple-white hover:bg-hover active:bg-hover/70 mt-auto h-12 w-full rounded-lg transition-colors duration-200'
      >
        {isUpdateProfilePending ? '저장 중...' : '저장'}
      </button>
      <p className='text-purple-black/50 hover:text-purple-black/80 text-center transition-colors duration-200'>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='cursor-pointer underline'
        >
          돌아가기
        </button>
      </p>
    </form>
  );
};

export default MyPageForm;
