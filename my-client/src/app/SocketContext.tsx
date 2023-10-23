import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  FC,
  PropsWithChildren,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import * as process from "process";

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];

type TCallState = {
  isReceivedCall: boolean;
  from: string;
  name: string;
  signal: string;
};

type TSocketContext = {
  stream?: MediaStream;
  call?: TCallState;
  me: string;
  name: string;
  callAccepted: boolean;
  callEnded: boolean;
  myVideo: React.MutableRefObject<HTMLVideoElement | null>;
  userVideo: React.MutableRefObject<HTMLVideoElement | null>;
  currentConnection: React.MutableRefObject<Peer.Instance | null>;
  setName: (arg: string) => void;
  answerCall: () => void;
  callUser: (id: string | number) => void;
  leaveCall: () => void;
};
const SocketContext = createContext<TSocketContext | null>(null);

const socket = io("http://localhost:5000");

const ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream>();
  const [me, setMe] = useState("");
  const [call, setCall] = useState<TCallState>();
  const [name, setName] = useState("");

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const currentConnection = useRef<Peer.Instance | null>(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((e) => console.error("Ошибочка " + e.message));

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });

    socket.on("callEnded", () => {
      console.log("callEnded");
      setCall(undefined);
      setCallEnded(false);
      userVideo.current = null;
      currentConnection.current = null;
      setCallAccepted(false);
    });
  }, []);
  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    if (call) {
      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: call.from });
      });

      peer.signal(call.signal);
    }

    peer.on("stream", (currentStream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    currentConnection.current = peer;
  };
  const callUser = (id: string | number) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    if (call) {
      peer.signal(call.signal);
    }

    peer.on("stream", (currentStream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    currentConnection.current = peer;
  };
  const leaveCall = () => {
    setCallEnded(true);
    if (currentConnection && currentConnection.current) {
      currentConnection.current.destroy();
    }
    socket.disconnect();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        currentConnection,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext, type TSocketContext };
