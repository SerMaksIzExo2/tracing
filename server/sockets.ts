import { Server } from "http";
import * as SocketIO from "socket.io";
import { PlayerMoveData, Session } from "./types";


export default class SocketManager implements SocketManager {
  io: SocketIO.Server;
  sessions: Session[];

  constructor() {
    this.io = {} as SocketIO.Server;
    this.sessions = [];
  }

  init(server: Server): void {
    this.io = new SocketIO.Server(server);

    this.io.on('connection', (socket: SocketIO.Socket) => {
      socket.on('playerMove', (data: PlayerMoveData) => {
        this.onPlayerMove(socket, data);
      });

      this.onConnection(socket);
    });
  }

  onPlayerMove(socket: SocketIO.Socket, data: PlayerMoveData): void {
    const session = this.sessions.find(session => session.playerSocket === socket || session.enemySocket === socket);

    if (session) {
      let opponentSocket: SocketIO.Socket | null;

      if (session.playerSocket === socket) {
        opponentSocket = session.enemySocket;

      } else {
        opponentSocket = session.playerSocket;
      }
      if (opponentSocket) {
        opponentSocket.emit('enemyMove', data);
      }

    }
  }

  getPendingSession(): Session | undefined {
    return this.sessions.find(session => session.playerSocket && !session.enemySocket);
  }

  createPendingSession(socket: SocketIO.Socket): void {
    const session: Session = { playerSocket: socket, enemySocket: null };
    this.sessions.push(session);
  }

  startGame(session: Session): void {
    session.playerSocket?.emit('gameStart', { master: true });
    session.enemySocket?.emit('gameStart');
  }

  onConnection(socket: SocketIO.Socket): void {
    socket.emit('gameStart');
    console.log(`new user connected ${socket.id}`);
    const session = this.getPendingSession();

    if (!session) {
      this.createPendingSession(socket);
    } else {
      session.enemySocket = socket;
      this.startGame(session);
      this.io.emit('game');
    }
  }
}