import image from '../../assets/react.svg';

const Comment = () => {
  return (
    <div
      className={`flex flex-row items-start justify-center gap-4 overflow-hidden`}
    >
      <div
        className={`bg-third flex flex-row items-center justify-center rounded-xl p-2`}
      >
        <img
          src={image}
          className={`bg-primary h-10 w-10 shrink-0 rounded-4xl`}
        />
        <p className={`text-purple-white w-20 shrink-0 text-center`}>닉네임</p>
      </div>

      <p className={`bg-third text-purple-white rounded-xl p-4`}>
        댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용
      </p>
    </div>
  );
};

export default Comment;
