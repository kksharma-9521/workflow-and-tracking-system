function LiveIndicator() {

  return (

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <div
        className="
          relative
          flex
          h-3
          w-3
        "
      >

        <span
          className="
            absolute
            inline-flex
            h-full
            w-full
            animate-ping
            rounded-full
            bg-green-400
            opacity-75
          "
        />

        <span
          className="
            relative
            inline-flex
            h-3
            w-3
            rounded-full
            bg-green-500
          "
        />

      </div>

      <span
        className="
          text-xs
          font-medium
          text-green-400
        "
      >
        LIVE
      </span>

    </div>
  );
}

export default LiveIndicator;