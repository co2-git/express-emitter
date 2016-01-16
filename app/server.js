'use strict';

import express                  from 'express';
import http                     from 'http';
import { EventEmitter }         from 'events';

class Server extends EventEmitter {

  nextSocketId = 0

  sockets = {}

  constructor (routes) {

    super();

    this.app = express();

    routes(this.app);

    process.nextTick(this.start.bind(this));

  }

  start () {

    if ( ! this.app.get('port') ) {
      this.app.set('port', options.port || process.env.PORT || 3000);
    }

    this.server = http.createServer(this.app);

    this.server.on('error', error => {
      this.emit('error', error);
    });

    this.server.listen(this.app.get('port'),  () => {
      this.emit('listening', { port : this.app.get('port') });
    });

    this.server.on('connection', socket => {
      // Add a newly connected socket
      const socketId = this.nextSocketId++;
      this.sockets[socketId] = socket;

      // Remove the socket when it closes
      socket.on('close', () => {
        delete this.sockets[socketId];
      });
    });

    this.server.on('close', () => this.emit('closed'));

    return this;
  }

  stop () {
    this.server.close();

    for (let socketId in this.sockets) {
      this.sockets[socketId].destroy();
    }

    return this;
  }

}
