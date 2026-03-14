import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfilePresignedUrl, uploadToS3 } from '../../api/s3-api';
import { useAuth } from '../../hooks/useAuth';

const MyPageForm = () => {
  const navigate = useNavigate();
  const { nickname, verifyPassword, isVerifyPending, updateProfile, isUpdateProfilePending } =
    useAuth();

  const [step, setStep] = useState<'verify' | 'edit'>('verify');

  // 1단계 - 비밀번호 확인
  const [password, setPassword] = useState('');

  // 2단계 - 프로필 편집
  const [newNickname, setNewNickname] = useState(nickname);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) return alert('비밀번호를 입력해주세요.');
    try {
      await verifyPassword(password);
      setStep('edit');
    } catch {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const { presignedUrl, imageUrl, contentType } =
        await getProfilePresignedUrl(file.name);
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
    if (newPassword && newPassword !== newPasswordConfirm)
      return alert('새 비밀번호가 일치하지 않습니다.');

    updateProfile({
      nickname: newNickname,
      profileImageUrl,
      newPassword: newPassword || undefined,
    });
  };

  if (step === 'verify') {
    return (
      <form
        onSubmit={handleVerify}
        className={`bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8`}
      >
        <p>🔒 본인 확인</p>
        <p className='text-purple-black/50 text-sm'>
          계속하려면 현재 비밀번호를 입력해주세요.
        </p>
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={`bg-purple-white h-10 rounded-lg px-4`}
          placeholder='현재 비밀번호'
        />
        <button
          type='submit'
          disabled={isVerifyPending}
          className={`bg-button text-purple-white hover:bg-hover active:bg-hover/70 mt-auto h-12 w-full rounded-lg transition-colors duration-200`}
        >
          {isVerifyPending ? '확인 중...' : '확인'}
        </button>
        <p className={`text-purple-black/50 hover:text-purple-black/80 text-center transition-colors duration-200`}>
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
  }

  return (
    <form
      onSubmit={handleUpdate}
      className={`bg-card-background flex w-75 flex-col gap-4 rounded-lg p-8`}
    >
      <p>👤 프로필 편집</p>

      {/* 프로필 이미지 */}
      <div className='flex flex-col items-center gap-2'>
        <div
          className='bg-purple-white flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-[filter] hover:brightness-90'
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt='프로필' className='h-full w-full object-cover' />
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
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='닉네임'
      />

      {/* 새 비밀번호 (선택) */}
      <input
        type='password'
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='새 비밀번호 (변경 시에만 입력)'
      />
      <input
        type='password'
        value={newPasswordConfirm}
        onChange={e => setNewPasswordConfirm(e.target.value)}
        className={`bg-purple-white h-10 rounded-lg px-4`}
        placeholder='새 비밀번호 확인'
      />

      <button
        type='submit'
        disabled={isUpdateProfilePending || isUploading}
        className={`bg-button text-purple-white hover:bg-hover active:bg-hover/70 mt-auto h-12 w-full rounded-lg transition-colors duration-200`}
      >
        {isUpdateProfilePending ? '저장 중...' : '저장'}
      </button>
    </form>
  );
};

export default MyPageForm;
