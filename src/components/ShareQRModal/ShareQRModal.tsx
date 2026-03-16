import { useEffect, useRef, useState } from 'react';

interface ShareQRModalProps {
  url: string;
  onClose: () => void;
}

const QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code';

const ShareQRModal = ({ url, onClose }: ShareQRModalProps) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const qrImageUrl = `${QR_API_BASE}?data=${encodeURIComponent(url)}&size=200x200&bgcolor=ffffff&color=2D2036`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 접근 실패 시 무시
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-200 flex items-center justify-center bg-black/50'
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='bg-card-background flex w-80 flex-col items-center gap-5 rounded-xl p-8 shadow-xl'>
        {/* 헤더 */}
        <div className='flex w-full items-center justify-between'>
          <h2 className='text-purple-black text-lg font-bold'>방 공유하기</h2>
          <button
            onClick={onClose}
            className='text-purple-black/60 hover:text-purple-black cursor-pointer transition-colors'
            aria-label='닫기'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* QR 코드 이미지 */}
        <div className='rounded-lg bg-white p-4'>
          <img
            src={qrImageUrl}
            alt='방 공유 QR 코드'
            width={200}
            height={200}
            className='block'
          />
        </div>

        <p className='text-purple-black/70 text-center text-sm'>
          QR 코드를 스캔하면
          <br />이 방으로 바로 올 수 있어요!
        </p>

        {/* 링크 복사 버튼 */}
        <button
          onClick={handleCopyLink}
          className='bg-button text-purple-white flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-[filter] hover:brightness-110'
        >
          {copied ? (
            <>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='h-4 w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4.5 12.75l6 6 9-13.5'
                />
              </svg>
              복사 완료!
            </>
          ) : (
            <>링크 복사</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareQRModal;
