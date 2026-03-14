import type { CommentResponse } from '../../types/comment';

interface CommentProps {
  comment: CommentResponse;
}

const Comment = ({ comment }: CommentProps) => {
  return (
    <div
      className={`flex flex-row items-start justify-center gap-4 overflow-hidden`}
    >
      <div className={`flex flex-row items-center justify-center gap-4 p-2`}>
        <div className={`bg-primary h-10 w-10 shrink-0 rounded-full`} />
        <p
          className={`text-purple-black w-30 shrink-0 text-center text-[18px] font-bold`}
        >
          {comment.nickname}
        </p>
      </div>

      <div
        className={`bg-third text-purple-white flex flex-col items-start justify-center gap-4 rounded-xl p-4`}
      >
        <p className='text-sm opacity-70'>{comment.createdAt}</p>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
