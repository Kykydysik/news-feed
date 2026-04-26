type Listener = (...args: any[]) => void;

import { io, Socket } from "socket.io-client";
import { UserToken } from "~/modules/profile/lib/is-user-auth";

class SocketService {
  private ws: Socket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private constructor() {}

  static getInstance(): SocketService {
    if (!(SocketService as any)._instance) {
      (SocketService as any)._instance = new SocketService();
    }
    return (SocketService as any)._instance;
  }

  connect() {
    this.ws = io(import.meta.env.VITE_BACKEND_WS, {
      auth: {
        token: UserToken.getToken(),
      },
    });

    this.ws.on("connect", () => {
      console.log(this.ws?.id); // x8WIv7-mJelg7on_ALbx
      this.emit("connect");
    });

    this.ws.on("connect_error", () => {
      this.emit("error");
    });

    this.ws.onAny((eventName, ...args) => {
      console.log(`Received event: ${eventName}`, args);
      this.emit(eventName, args);
    });
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.emit("disconnect");
  }

  on(event: string, listener: Listener): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());

    this.listeners.get(event)!.add(listener);

    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    this.listeners.get(event)?.delete(listener);
  }

  private emit(event: string, data?: any) {
    this.listeners.get(event)?.forEach((fn) => fn(data));
  }

  send(type: string, payload?: any) {
    if (this.ws?.connected) {
      this.ws.emit(type, payload);
    } else {
      console.warn(`Socket not open. Message "${type}" dropped.`);
    }
  }
}

export const socketService = SocketService.getInstance();
