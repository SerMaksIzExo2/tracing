
import { Server } from "http";
import * as SocketIO from "socket.io";
import { PlayerMoveData, Session } from "./types";

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
