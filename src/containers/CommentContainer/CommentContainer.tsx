import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createComment, getCommentsScroll } from '../../api/comment-api';
import Comment from '../../components/Comment/Comment';
import type { RootState } from '../../store';
import type { CommentResponse } from '../../types/comment';

interface CommentContainerProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const CommentContainer = ({ inputRef }: CommentContainerProps) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const resolvedRef = inputRef ?? internalRef;
  const roomId = useSelector((state: RootState) => state.shelf.roomId);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [nextCursorId, setNextCursorId] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 방 바뀔 때마다 초기 댓글 로드
  const loadInitial = useCallback(() => {
    if (roomId == null) return;
    getCommentsScroll(roomId, null, 10)
      .then(page => {
        setComments(page.comments);
        setNextCursorId(page.nextCursorId);
        setHasNext(page.hasNext);
      })
      .catch(console.error);
  }, [roomId]);

  useEffect(() => {
    setComments([]);
    setNextCursorId(null);
    setHasNext(false);
    loadInitial();
  }, [loadInitial]);

  const handleLoadMore = async () => {
    if (!hasNext || roomId == null) return;
    setIsLoadingMore(true);
    try {
      const page = await getCommentsScroll(roomId, nextCursorId, 10);
      setComments(prev => [...prev, ...page.comments]);
      setNextCursorId(page.nextCursorId);
      setHasNext(page.hasNext);
    } catch (err) {
      console.error('댓글 더보기 실패:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
    <div className='bg-card-background flex w-full flex-col items-start justify-start gap-4 rounded-lg p-6 md:p-12'>
      {/* 댓글 작성 인풋 */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className='flex w-full gap-3'>
          <input
            ref={resolvedRef}
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
        <>
          {comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpdate={updated =>
                setComments(prev =>
                  prev.map(c => (c.id === updated.id ? updated : c))
                )
              }
              onDelete={id =>
                setComments(prev => prev.filter(c => c.id !== id))
              }
            />
          ))}

          {/* 더보기 버튼 */}
          {hasNext && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className='text-purple-black/60 hover:text-purple-black w-full py-2 text-sm transition-colors disabled:opacity-50'
            >
              {isLoadingMore ? '불러오는 중...' : '댓글 더보기'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentContainer;
