import { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../../api/comment-api';
import type { RootState } from '../../store';
import type { CommentResponse } from '../../types/comment';

interface CommentProps {
  comment: CommentResponse;
  onUpdate: (updated: CommentResponse) => void;
  onDelete: (commentId: number) => void;
}

const Comment = ({ comment, onUpdate, onDelete }: CommentProps) => {
  const myNickname = useSelector((state: RootState) => state.auth.nickname);
  const isMine = myNickname === comment.nickname;
  const displayDate = comment.createdAt?.slice(0, 16) ?? '';

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setIsSaving(true);
    try {
      const updated = await updateComment(comment.id, {
        content: editContent.trim(),
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(comment.id);
      onDelete(comment.id);
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      {/* 헤더: 프로필 + 닉네임/날짜 + 수정/삭제 버튼 */}
      <div className='flex flex-row items-center gap-4 p-2'>
        <img
          src={comment.profileImageUrl || '/icon.png'}
          alt={comment.nickname}
          className='bg-primary h-10 w-10 shrink-0 rounded-full object-cover'
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/icon.png';
          }}
        />
        <div className='flex flex-row items-baseline gap-2'>
          <p className='text-purple-black shrink-0 text-start text-[18px] font-bold'>
            {comment.nickname}
          </p>
          <p className='text-purple-black/50 text-sm'>{displayDate}</p>
        </div>

        {isMine && !isEditing && (
          <div className='ml-auto flex gap-2'>
            {/* 수정 */}
            <button
              onClick={() => setIsEditing(true)}
              className='text-point-green transition-[filter] hover:brightness-125'
              title='수정'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
              </svg>
            </button>
            {/* 삭제 */}
            <button
              onClick={handleDelete}
              className='text-point-pink transition-[filter] hover:brightness-125'
              title='삭제'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 내용 */}
      {isEditing ? (
        <div className='flex gap-2 px-2 pb-2'>
          <input
            type='text'
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className='bg-purple-white text-purple-black flex-1 rounded-lg px-3 py-2 text-sm'
            disabled={isSaving}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={isSaving || !editContent.trim()}
            className='bg-point-green text-purple-white rounded px-3 py-2 text-xs transition-[filter] hover:brightness-110 disabled:opacity-50'
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
          <button
            onClick={handleCancel}
            className='bg-card-background text-purple-black rounded px-3 py-2 text-xs transition-[filter] hover:brightness-90'
          >
            취소
          </button>
        </div>
      ) : (
        <p className='text-purple-black px-2 pb-2'>{comment.content}</p>
      )}

      <div className='bg-third h-px w-full' />
    </div>
  );
};

export default Comment;
