import { Typography } from "@/shared/Typography";
import styles from "./AppBar.module.scss";

export const AppBar = () => {
  return (
    <div className={styles.appBar}>
      <Typography level={2} weight="bold">
        WebRTC Связь
      </Typography>
    </div>
  );
};
