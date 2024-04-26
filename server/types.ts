import * as SocketIO from "socket.io";

export type PlayerMoveData = {
  x: number;
  y: number;
  angle: number;
}
export type Session = {
  playerSocket: SocketIO.Socket | null;
  enemySocket: SocketIO.Socket | null;
}