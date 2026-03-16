import { useEffect, useRef, useState } from 'react';

interface GoodsRegisterModalProps {
  imageUrl: string;
  defaultName: string;
  onConfirm: (name: string, description: string) => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

const GoodsRegisterModal = ({
  imageUrl,
  defaultName,
  onConfirm,
  onCancel,
  isConfirming = false,
}: GoodsRegisterModalProps) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
    nameInputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim(), description.trim());
  };

  return (
    <div
      className='fixed inset-0 z-200 flex items-center justify-center bg-black/50'
      onClick={e => {
        if (e.target === e.currentTarget && !isConfirming) onCancel();
      }}
    >
      <div className='bg-card-background flex w-96 flex-col gap-6 rounded-xl p-8 shadow-xl'>
        <h2 className='text-purple-black text-lg font-bold'>굿즈 등록</h2>

        {/* 이미지 미리보기 */}
        <div className='bg-purple-white flex h-40 items-center justify-center overflow-hidden rounded-lg'>
          <img
            src={imageUrl}
            alt='preview'
            className='h-full w-full object-contain'
          />
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-purple-black/70 text-sm'>이름 *</label>
            <input
              ref={nameInputRef}
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              className='bg-purple-white text-purple-black rounded-lg px-4 py-2'
              placeholder='굿즈 이름 (필수)'
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-purple-black/70 text-sm'>설명</label>
            <input
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='bg-purple-white text-purple-black rounded-lg px-4 py-2'
              placeholder='굿즈 설명 (선택)'
            />
          </div>

          <div className='mt-2 flex gap-3'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isConfirming}
              className='bg-point-pink text-purple-white flex-1 rounded-lg py-2 transition-[filter] hover:brightness-110 active:brightness-80 disabled:opacity-50'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={!name.trim() || isConfirming}
              className='bg-point-green text-purple-white flex-1 rounded-lg py-2 transition-[filter] hover:brightness-110 active:brightness-80 disabled:opacity-50'
            >
              {isConfirming ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoodsRegisterModal;
