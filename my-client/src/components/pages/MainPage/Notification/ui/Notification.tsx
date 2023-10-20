import React, { useContext } from "react";

import { SocketContext, TSocketContext } from "@/app/SocketContext";
import { Button } from "@/shared/Button";

export const Notification = () => {
  const { answerCall, call, callAccepted } = useContext(
    SocketContext
  ) as TSocketContext;

  return (
    <>
      {call && call.isReceivedCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>{call.name} is calling:</h1>
          <Button onClick={answerCall}>Answer</Button>
        </div>
      )}
    </>
  );
};
