import io, { Socket } from 'socket.io-client';
import { PlayerMoveData } from '../types';

const HOST = 'http://localhost:3000'

export default class Client extends Phaser.Events.EventEmitter {
  master = false;
  socket: Socket;
  sent = {};
  constructor() {
    super();
  }

  init() {
    this.socket = io(HOST)
    this.socket.on('connect', () => {
      console.log('client connected');
    })

    this.socket.on('disconnect', () => {
      console.log('client disconnected');
    })

    this.socket.on('gameStart', (data: { master: boolean; }) => {
      if (data && data.master) {
        this.master = data.master
      }
      this.emit('game');
    });

    this.socket.on('enemyMove', (data: PlayerMoveData) => {
      this.emit('data', data);
    })

    return this.socket;
  }

  send(data: PlayerMoveData) {
    if (JSON.stringify(data) !== JSON.stringify(this.sent)) {
      this.sent = data;
      this.socket.emit('playerMove', data);
    }
  }
}