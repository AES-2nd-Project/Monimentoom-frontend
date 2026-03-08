const Shelf = () => {
  const items = Array.from({ length: 16 });
  return (
    <div
      className={`grid h-130 w-125 shrink-0 grid-cols-4 grid-rows-4 bg-[url('/src/assets/shelf_front.png')] bg-cover bg-center bg-no-repeat px-15 pt-14 pb-20`}
    >
      {items.map((_, index) => (
        <div
          key={index}
          className={`group hover:bg-card-background border-border m-0.5 flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-transparent text-center transition-colors duration-200 hover:border-transparent`}
        >
          <span
            className={`text-purple-white group-hover:text-purple-black transition-colors duration-200`}
          >
            +
          </span>
        </div>
      ))}
    </div>
  );
};

export default Shelf;
