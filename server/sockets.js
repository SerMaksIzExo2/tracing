"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketIO = require("socket.io");
var SocketManager = /** @class */ (function () {
    function SocketManager() {
        this.io = {};
        this.sessions = [];
    }
    SocketManager.prototype.init = function (server) {
        var _this = this;
        this.io = new SocketIO.Server(server);
        this.io.on('connection', function (socket) {
            socket.on('playerMove', function (data) {
                _this.onPlayerMove(socket, data);
            });
            _this.onConnection(socket);
        });
    };
    SocketManager.prototype.onPlayerMove = function (socket, data) {
        var session = this.sessions.find(function (session) { return session.playerSocket === socket || session.enemySocket === socket; });
        if (session) {
            var opponentSocket = void 0;
            if (session.playerSocket === socket) {
                opponentSocket = session.enemySocket;
            }
            else {
                opponentSocket = session.playerSocket;
            }
            if (opponentSocket) {
                opponentSocket.emit('enemyMove', data);
            }
        }
    };
    SocketManager.prototype.getPendingSession = function () {
        return this.sessions.find(function (session) { return session.playerSocket && !session.enemySocket; });
    };
    SocketManager.prototype.createPendingSession = function (socket) {
        var session = { playerSocket: socket, enemySocket: null };
        this.sessions.push(session);
    };
    SocketManager.prototype.startGame = function (session) {
        var _a, _b;
        (_a = session.playerSocket) === null || _a === void 0 ? void 0 : _a.emit('gameStart', { master: true });
        (_b = session.enemySocket) === null || _b === void 0 ? void 0 : _b.emit('gameStart');
    };
    SocketManager.prototype.onConnection = function (socket) {
        socket.emit('gameStart');
        console.log("new user connected ".concat(socket.id));
        var session = this.getPendingSession();
        if (!session) {
            this.createPendingSession(socket);
        }
        else {
            session.enemySocket = socket;
            this.startGame(session);
            this.io.emit('game');
        }
    };
    return SocketManager;
}());
exports.default = SocketManager;
