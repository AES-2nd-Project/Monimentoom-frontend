import type { CommentResponse } from '../../types/comment';

interface CommentProps {
  comment: CommentResponse;
}

const Comment = ({ comment }: CommentProps) => {
  const displayDate = comment.createdAt?.slice(0, 16) ?? '';

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex flex-row items-center gap-4 p-2'>
        <div className='bg-primary h-10 w-10 shrink-0 rounded-full' />
        <div className='flex flex-row items-baseline gap-2'>
          <p className='text-purple-black shrink-0 text-start text-[18px] font-bold'>
            {comment.nickname}
          </p>
          <p className='text-purple-black/50 text-sm'>{displayDate}</p>
        </div>
      </div>

      <p className='text-purple-black px-2 pb-2'>{comment.content}</p>

      <div className='bg-third h-px w-full' />
    </div>
  );
};

export default Comment;
