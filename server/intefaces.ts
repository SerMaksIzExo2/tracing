
import { Server } from "http";
import * as SocketIO from "socket.io";
import { PlayerMoveData } from "./types";

export interface SocketManager {
  sessions: Session[];
  io: SocketIO.Server;
  init(server: Server): void;
  onConnection(socket: SocketIO.Socket): void;
  getPendingSession(): Session | undefined;
  createPendingSession(socket: SocketIO.Socket);
  startGame(session: Session);
  onPlayerMove(socket: SocketIO.Socket, data: PlayerMoveData)
}

export type Session = {
  playerSocket: SocketIO.Socket | null;
  enemySocket: SocketIO.Socket | null;
}