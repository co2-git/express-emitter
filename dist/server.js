'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _events = require('events');

var _cluster3 = require('./cluster');

var _cluster4 = _interopRequireDefault(_cluster3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Server = function (_EventEmitter) {
  _inherits(Server, _EventEmitter);

  function Server(customize) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Server);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Server).call(this));

    _this.nextSocketId = 0;
    _this.sockets = {};
    _this.cluster_mode = false;
    _this.master = null;
    _this.forks = [];

    _this.app = (0, _express2.default)();

    if (typeof customize === 'function') {
      customize(_this.app);
    }

    process.nextTick(function () {
      if (options.cluster) {
        _this.cluster(typeof options.cluster === 'number' && options.cluster);
      } else {
        _this.start();
      }
    });
    return _this;
  }

  _createClass(Server, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.emit('starting');

      if (!this.app.get('port')) {
        this.app.set('port', process.env.PORT || 3000);
      }

      this.server = _http2.default.createServer(this.app);

      this.server.on('error', function (error) {
        _this2.emit('error', error);
      });

      this.server.listen(this.app.get('port'), function () {
        _this2.emit('listening');
      });

      this.server.on('connection', function (socket) {
        var socketId = _this2.nextSocketId++;

        _this2.sockets[socketId] = socket;

        socket.on('close', function () {
          delete _this2.sockets[socketId];
        });
      });

      this.server.on('close', function () {
        return _this2.emit('closed');
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
      var _this3 = this;

      return this.stop().on('closed', function () {
        return _this3.start();
      });
    }
  }, {
    key: 'cluster',
    value: function cluster() {
      var forkNumber = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

      this.cluster_mode = true;

      var _cluster2 = (0, _cluster4.default)(this.start.bind(this), forkNumber);

      var master = _cluster2.master;
      var forks = _cluster2.forks;

      this.master = master;
      this.forks = forks;
    }
  }, {
    key: 'reload',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                this.emit('reloading');
                _context.next = 4;
                return this.reloadForks();

              case 4:
                console.log(this.forks);
                this.emit('reloaded');
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);

                this.emit('error', _context.t0);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function reload() {
        return _ref.apply(this, arguments);
      }

      return reload;
    }()
  }, {
    key: 'reloadForks',
    value: function reloadForks() {
      var _this4 = this;

      return new Promise(function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(resolve, reject) {
          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fork;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context2.prev = 4;
                  _iterator = _this4.forks[Symbol.iterator]();

                case 6:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context2.next = 13;
                    break;
                  }

                  fork = _step.value;
                  _context2.next = 10;
                  return _this4.reloadFork(fork);

                case 10:
                  _iteratorNormalCompletion = true;
                  _context2.next = 6;
                  break;

                case 13:
                  _context2.next = 19;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t0 = _context2['catch'](4);
                  _didIteratorError = true;
                  _iteratorError = _context2.t0;

                case 19:
                  _context2.prev = 19;
                  _context2.prev = 20;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 22:
                  _context2.prev = 22;

                  if (!_didIteratorError) {
                    _context2.next = 25;
                    break;
                  }

                  throw _iteratorError;

                case 25:
                  return _context2.finish(22);

                case 26:
                  return _context2.finish(19);

                case 27:
                  _context2.next = 32;
                  break;

                case 29:
                  _context2.prev = 29;
                  _context2.t1 = _context2['catch'](0);

                  reject(_context2.t1);

                case 32:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this4, [[0, 29], [4, 15, 19, 27], [20,, 22, 26]]);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'reloadFork',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(fork) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', new Promise(function (resolve) {
                  fork.kill();
                  var newFork = _this5.master.fork();
                  newFork.on('listening', function () {
                    _this5.forks.push(newFork);
                  });
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function reloadFork(_x5) {
        return _ref3.apply(this, arguments);
      }

      return reloadFork;
    }()
  }]);

  return Server;
}(_events.EventEmitter);

exports.default = Server;