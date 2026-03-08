const Shelf = () => {
  const items = Array.from({ length: 16 });
  return (
    <div
      className={`bg-primary grid h-125 w-125 shrink-0 grid-cols-4 grid-rows-4`}
    >
      {items.map((_, index) => (
        <div
          key={index}
          className={`bg-card-background border-boder m-0.5 flex shrink-0 items-center justify-center rounded-lg border text-center`}
        >
          +
        </div>
      ))}
    </div>
  );
};

export default Shelf;
