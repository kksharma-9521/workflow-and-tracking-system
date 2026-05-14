import {
  useEffect,
  useRef,
} from "react";

import type {
  TrackingFrame,
} from "../../types/tracking";

type Props = {

  videoRef:
    React.RefObject<HTMLVideoElement | null>;

  trackingData:
    TrackingFrame[];
};


function TrackingOverlay({
  videoRef,
  trackingData,
}: Props) {

  const canvasRef =
    useRef<HTMLCanvasElement>(
      null
    );


  useEffect(() => {

    let animationFrame:
      number;


    function render() {

      const canvas =
        canvasRef.current;

      const video =
        videoRef.current;


      if (
        !canvas ||
        !video
      ) {

        animationFrame =
          requestAnimationFrame(
            render
          );

        return;
      }


      const ctx =
        canvas.getContext(
          "2d"
        );


      if (!ctx) {

        animationFrame =
          requestAnimationFrame(
            render
          );

        return;
      }


      canvas.width =
        video.videoWidth ||
        video.clientWidth;

      canvas.height =
        video.videoHeight ||
        video.clientHeight;


      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      const currentTime =
        video.currentTime;


      const nearestFrame =
        trackingData.find(
          (
            frame
          ) =>

            Math.abs(
              frame.timestamp -
              currentTime
            ) < 0.05
        );


      if (
        nearestFrame
      ) {

        nearestFrame.boxes.forEach(
          (
            box
          ) => {

            /* Bounding Box */

            ctx.strokeStyle =
              "#3B82F6";

            ctx.lineWidth = 3;

            ctx.strokeRect(
              box.x,
              box.y,
              box.width,
              box.height
            );


            /* Label Background */

            ctx.fillStyle =
              "#3B82F6";

            ctx.fillRect(
              box.x,
              box.y - 28,
              90,
              24
            );


            /* Label Text */

            ctx.fillStyle =
              "#FFFFFF";

            ctx.font =
              "bold 14px Arial";

            ctx.fillText(
              `ID ${box.id}`,
              box.x + 10,
              box.y - 10
            );
          }
        );
      }


      animationFrame =
        requestAnimationFrame(
          render
        );
    }


    render();


    return () => {

      cancelAnimationFrame(
        animationFrame
      );
    };

  }, [
    trackingData,
    videoRef,
  ]);


  return (

    <canvas
      ref={canvasRef}
      className="
        pointer-events-none
        absolute
        inset-0
        z-20
        h-full
        w-full
      "
    />
  );
}

export default TrackingOverlay;