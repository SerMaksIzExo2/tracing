"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var path = require("path");
var express = require("express");
var sockets_1 = require("./sockets");
var PORT = 3000;
var DOCROOT = './../dist';
var app = express();
var server = http.createServer(app);
var docRoot = path.join(__dirname, DOCROOT);
app.use(express.static(docRoot));
var socketManager = new sockets_1.default();
socketManager.init(server);
server.listen(PORT, function () {
    console.log("server in running on port ".concat(PORT));
});
