'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _events = require('events');

var Server = (function (_EventEmitter) {
  _inherits(Server, _EventEmitter);

  function Server(customize) {
    _classCallCheck(this, Server);

    _get(Object.getPrototypeOf(Server.prototype), 'constructor', this).call(this);

    this.nextSocketId = 0;
    this.sockets = {};
    this.app = (0, _express2['default'])();

    if (typeof customize === 'function') {
      customize(this.app);
    }

    process.nextTick(this.start.bind(this));
  }

  _createClass(Server, [{
    key: 'start',
    value: function start() {
      var _this = this;

      this.emit('starting');

      if (!this.app.get('port')) {
        this.app.set('port', process.env.PORT || 3000);
      }

      this.server = _http2['default'].createServer(this.app);

      this.server.on('error', function (error) {
        _this.emit('error', error);
      });

      this.server.listen(this.app.get('port'), function () {
        return _this.emit('listening');
      });

      this.server.on('connection', function (socket) {
        var socketId = _this.nextSocketId++;

        _this.sockets[socketId] = socket;

        socket.on('close', function () {
          delete _this.sockets[socketId];
        });
      });

      this.server.on('close', function () {
        return _this.emit('closed');
      });

      return this;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.emit('closing');

      this.server.close();

      for (var socketId in this.sockets) {
        this.sockets[socketId].destroy();
      }

      return this;
    }
  }, {
    key: 'restart',
    value: function restart() {
      var _this2 = this;

      return this.stop().on('closed', function () {
        return _this2.start();
      });
    }
  }]);

  return Server;
})(_events.EventEmitter);

exports['default'] = Server;
module.exports = exports['default'];