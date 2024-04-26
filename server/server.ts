import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import SocketManager from './sockets';

const PORT = 3000;
const DOCROOT = './../dist';


const app: express.Application = express();
const server: http.Server = http.createServer(app);

const docRoot = path.join(__dirname, DOCROOT);
app.use(express.static(docRoot));

const socketManager = new SocketManager();
socketManager.init(server);

server.listen(PORT, () => {
  console.log(`server in running on port ${PORT}`);

})
