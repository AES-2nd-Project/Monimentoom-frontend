import image from '../../assets/react.svg';

const Comment = () => {
  return (
    <div
      className={`flex flex-row items-start justify-center gap-4 overflow-hidden`}
    >
      <div className={`flex flex-row items-center justify-center gap-4 p-2`}>
        <img
          src={image}
          className={`bg-primary h-10 w-10 shrink-0 rounded-4xl`}
        />
        <p
          className={`text-purple-black w-30 shrink-0 text-center text-[18px] font-bold`}
        >
          123
        </p>
      </div>

      <div
        className={`bg-third text-purple-white flex flex-col items-start justify-center gap-4 rounded-xl p-4`}
      >
        <p>2026-03-13</p>
        <p>
          댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용
        </p>
      </div>
    </div>
  );
};

export default Comment;
