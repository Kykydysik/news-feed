import { useState, useEffect } from "react";
import { socketService } from "~/shared/api/socket-server";

export function useSocketStatus() {
  const [status, setStatus] = useState<
    "connecting" | "open" | "closed" | "error"
  >("closed");

  useEffect(() => {
    const unsubOpen = socketService.on("connect", () => setStatus("open"));
    const unsubClose = socketService.on("disconnect", () =>
      setStatus("closed"),
    );
    const unsubError = socketService.on("error", () => setStatus("error"));

    socketService.connect();

    return () => {
      unsubOpen();
      unsubClose();
      unsubError();
    };
  }, []);

  // const send = useCallback((type: string, payload?: any) => {
  //   socketService.send(type, payload);
  // }, []);

  return { status };
}
