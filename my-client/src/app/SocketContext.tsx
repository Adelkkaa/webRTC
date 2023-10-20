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
    const promise = navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((e) => console.error("Ошибочка " + e.message));
    console.log(promise);
    socket.on("me", (id) => setMe(id));

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
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
        socket.emit("answercall", { signal: data, to: call.from });
      });

      peer.signal(call.signal);
    }

    peer.on("stream", (currentStream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    if (currentConnection && currentConnection.current) {
      currentConnection.current = peer;
    }
  };
  const callUser = (id: string | number) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    if (call) {
      peer.on("signal", (data) => {
        socket.emit("calluser", {
          userToCall: id,
          signalData: data,
          from: me,
          name,
        });
      });

      peer.signal(call.signal);
    }

    peer.on("stream", (currentStream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    if (currentConnection && currentConnection.current) {
      currentConnection.current = peer;
    }
  };
  const leaveCall = () => {
    setCallEnded(true);
    if (currentConnection && currentConnection.current) {
      currentConnection.current.destroy();
    }
    window.location.reload();
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext, type TSocketContext };
