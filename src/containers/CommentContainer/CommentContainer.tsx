import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createComment, getComments } from '../../api/comment-api';
import Comment from '../../components/Comment/Comment';
import type { RootState } from '../../store';
import type { CommentResponse } from '../../types/comment';

const CommentContainer = () => {
  const roomId = useSelector((state: RootState) => state.shelf.roomId);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // roomId가 세팅되면 댓글 조회
  useEffect(() => {
    if (roomId == null) return;
    getComments(roomId).then(setComments).catch(console.error);
  }, [roomId]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || roomId == null) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment({
        roomId,
        content: content.trim(),
      });
      setComments(prev => [newComment, ...prev]);
      setContent('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-card-background flex flex-1 flex-col items-start justify-start gap-8 rounded-lg p-12`}
    >
      {/* 댓글 작성 인풋 */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className='flex w-full gap-3'>
          <input
            type='text'
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='댓글 작성'
            className='bg-purple-white flex-1 rounded-lg px-4 py-3'
            disabled={isSubmitting}
          />
          <button
            type='submit'
            disabled={isSubmitting || !content.trim()}
            className='bg-button text-purple-white hover:bg-hover active:bg-hover/70 shrink-0 rounded-lg px-6 py-3 transition-colors duration-200 disabled:opacity-50'
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </form>
      )}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <p className='text-purple-black/40 w-full text-center'>
          아직 댓글이 없습니다.
        </p>
      ) : (
        comments.map(comment => <Comment key={comment.id} comment={comment} />)
      )}
    </div>
  );
};

export default CommentContainer;
