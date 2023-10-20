import { Typography } from "@/shared/Typography";
import styles from "./VideoPlayer.module.scss";
import { useContext, useEffect } from "react";
import { SocketContext, TSocketContext } from "@/app/SocketContext";

export const VideoPlayer = () => {
  const { name, callAccepted, userVideo, callEnded, stream, call, myVideo } =
    useContext(SocketContext) as TSocketContext;

  useEffect(() => {
    if (myVideo && myVideo.current && stream) {
      myVideo.current.srcObject = stream;
      myVideo.current.onloadedmetadata = () => myVideo.current?.play();
    }
  }, [stream]);
  return (
    <div className={styles.videoContainer}>
      {stream && (
        <div className={styles.videoPaper}>
          <div className={styles.videoItem}>
            <Typography
              className={styles.videoTitle}
              level={4}
              weight="semibold"
            >
              {name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className={styles.video}
            />
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className={styles.videoPaper}>
          <div className={styles.videoItem}>
            <Typography
              className={styles.videoTitle}
              level={4}
              weight="semibold"
            >
              {call?.name || "Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={userVideo}
              autoPlay
              className={styles.video}
            />
          </div>
        </div>
      )}
    </div>
  );
};
