import React, { useContext, useState, FC, PropsWithChildren } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";

import { SocketContext, TSocketContext } from "@/app/SocketContext";
import { Typography } from "@/shared/Typography";
import { Button } from "@/shared/Button";
import { Input } from "@/shared/Input";

import styles from "./Options.module.scss";

export const Options: FC<PropsWithChildren> = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext) as TSocketContext;
  const [idToCall, setIdToCall] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.paper}>
        <form
          className={styles.root}
          noValidate
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.rootWrapper}>
            <div className={styles.rootItem}>
              <Typography color="red" level={4}>
                Account Info
              </Typography>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <CopyToClipboard
                text={me}
                onCopy={() =>
                  toast.success("ID Успешно скопирован!", {
                    toastId: "successCopyId",
                  })
                }
              >
                <Button onClick={() => {}}>Copy Your ID</Button>
              </CopyToClipboard>
            </div>
            <div className={styles.rootItem}>
              <Typography color="red" level={4}>
                Make a call
              </Typography>
              <Input
                label="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              {callAccepted && !callEnded ? (
                <Button onClick={leaveCall}>Hang Up</Button>
              ) : (
                <Button onClick={() => callUser(idToCall)}>Call</Button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};
