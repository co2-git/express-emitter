import 'babel-polyfill';
import express from 'express';
import http from 'http';
import {EventEmitter} from 'events';
import cluster from './cluster';

class Server extends EventEmitter {
  nextSocketId = 0
  sockets = {}
  cluster_mode = false;
  master = null;
  forks = [];

  constructor(customize, options = {}) {
    super();
    this.app = express();

    if (typeof customize === 'function') {
      customize(this.app);
    }

    process.nextTick(() => {
      if (options.cluster) {
        this.cluster(typeof options.cluster === 'number' && options.cluster);
      } else {
        this.start();
      }
    });
  }

  start() {
    this.emit('starting');

    if (!this.app.get('port')) {
      this.app.set('port', process.env.PORT || 3000);
    }

    this.server = http.createServer(this.app);

    this.server.on('error', error => {
      this.emit('error', error);
    });

    this.server.listen(this.app.get('port'), () => {
      this.emit('listening');
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

  stop() {
    this.emit('closing');
    this.server.close();

    for (let socketId in this.sockets) {
      this.sockets[socketId].destroy();
    }

    return this;
  }

  restart() {
    return this.stop()
      .on('closed', () => this.start());
  }

  cluster(forkNumber = 2) {
    this.cluster_mode = true;
    const {master, forks} = cluster(::this.start, forkNumber);
    this.master = master;
    this.forks = forks;
  }

  async reload() {
    try {
      this.emit('reloading');
      await this.reloadForks();
      console.log(this.forks);
      this.emit('reloaded');
    } catch (error) {
      this.emit('error', error);
    }
  }

  reloadForks() {
    return new Promise(async (resolve, reject) => {
      try {
        for (const fork of this.forks) {
          await this.reloadFork(fork);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async reloadFork(fork) {
    return new Promise((resolve) => {
      fork.kill();
      const newFork = this.master.fork();
      newFork.on('listening', () => {
        this.forks.push(newFork);
        
      });
    });
  }
}

export default Server;
