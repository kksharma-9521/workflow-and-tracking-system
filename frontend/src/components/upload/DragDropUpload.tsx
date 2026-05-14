import {
  FileVideo,
  UploadCloud,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  useRef,
  useState,
} from "react";


type Props = {

  onFileSelect: (
    file: File
  ) => void;
};


function DragDropUpload({
  onFileSelect,
}: Props) {

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    dragActive,
    setDragActive,
  ] = useState(false);

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );


  function validateFile(
    file: File
  ) {

    const maxSize =
      1024 *
      1024 *
      500;

    if (
      !file.type.startsWith(
        "video/"
      )
    ) {

    toast.error(
    "Only video files allowed"
    );

      return false;
    }

    if (
      file.size > maxSize
    ) {

    toast.error(
        "Max upload size is 500MB"
    );

      return false;
    }

    return true;
  }


  function handleFile(
    file: File
  ) {

    const valid =
      validateFile(
        file
      );

    if (!valid)
      return;

    setSelectedFile(
      file
    );

    onFileSelect(
      file
    );
  }


  function handleDrop(
    event:
      React.DragEvent<HTMLDivElement>
  ) {

    event.preventDefault();

    setDragActive(false);

    if (
      event.dataTransfer
        .files &&
      event.dataTransfer
        .files[0]
    ) {

      handleFile(
        event
          .dataTransfer
          .files[0]
      );
    }
  }


  return (

    <div
      onDragOver={(
        event
      ) => {

        event.preventDefault();

        setDragActive(
          true
        );
      }}

      onDragLeave={() =>
        setDragActive(
          false
        )
      }

      onDrop={handleDrop}

      className={`
        rounded-2xl
        border-2
        border-dashed
        p-10
        transition-all
        duration-300

        ${
          dragActive
            ? `
              border-blue-500
              bg-blue-500/10
            `
            : `
              border-[#374151]
              bg-[#111827]
            `
        }
      `}
    >

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >

        <div
          className="
            rounded-full
            bg-[#0F172A]
            p-5
          "
        >

          <UploadCloud
            size={42}
            className="
              text-blue-400
            "
          />

        </div>


        <h2
          className="
            mt-6
            text-2xl
            font-bold
          "
        >
          Upload Tracking Video
        </h2>

        <p
          className="
            mt-3
            max-w-md
            text-sm
            text-gray-400
          "
        >
          Drag and drop sports,
          traffic, surveillance,
          or crowd videos for
          realtime AI tracking
        </p>


        {/* Hidden Input */}

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(
            event
          ) => {

            if (
              event.target
                .files?.[0]
            ) {

              handleFile(
                event.target
                  .files[0]
              );
            }
          }}
        />


        {/* Button */}

        <button
          onClick={() =>
            inputRef.current?.click()
          }
          className="
            mt-8
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            transition-all
            hover:bg-blue-500
          "
        >
          Select Video
        </button>


        {/* File Preview */}

        {selectedFile && (

          <div
            className="
              mt-8
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-[#1F2937]
              bg-[#0F172A]
              px-5
              py-4
            "
          >

            <FileVideo
              size={22}
              className="
                text-blue-400
              "
            />

            <div
              className="
                text-left
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                "
              >
                {
                  selectedFile.name
                }
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-400
                "
              >
                {(
                  selectedFile.size /
                  (
                    1024 *
                    1024
                  )
                ).toFixed(2)}
                MB
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default DragDropUpload;