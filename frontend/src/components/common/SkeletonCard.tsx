function SkeletonCard() {

  return (

    <div
      className="
        animate-pulse
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#111827]
        p-6
      "
    >

      <div
        className="
          h-4
          w-24
          rounded
          bg-[#1F2937]
        "
      />

      <div
        className="
          mt-6
          h-10
          w-32
          rounded
          bg-[#1F2937]
        "
      />

      <div
        className="
          mt-6
          h-3
          w-20
          rounded
          bg-[#1F2937]
        "
      />

    </div>
  );
}

export default SkeletonCard;