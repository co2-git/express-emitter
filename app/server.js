'use strict';

import express                  from 'express';
import http                     from 'http';
import { EventEmitter }         from 'events';

class Server extends EventEmitter {

  nextSocketId = 0

  sockets = {}

  constructor (customize) {

    super();

    this.app = express();

    if ( typeof customize === 'function' ) {
      customize(this.app);
    }

    process.nextTick(this.start.bind(this));

  }

  start () {

    this.emit('starting');

    if ( ! this.app.get('port') ) {
      this.app.set('port', process.env.PORT || 3000);
    }

    this.server = http.createServer(this.app);

    this.server.on('error', error => {
      this.emit('error', error);
    });

    this.server.listen(this.app.get('port'),  () => {
      this.emit('listening', { port : this.app.get('port') });
    });

    this.server.on('connection', socket => {
      const socketId = this.nextSocketId++;
      this.sockets[socketId] = socket;

      socket.on('close', () => {
        delete this.sockets[socketId];
      });
    });

    this.server.on('close', () => this.emit('closed'));

    return this;
  }

  stop () {
    this.emit('closing');

    this.server.close();

    for (let socketId in this.sockets) {
      this.sockets[socketId].destroy();
    }

    return this;
  }

}
