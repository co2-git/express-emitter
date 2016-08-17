'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clusterServer;

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clusterServer(fn, forkNumber) {
  if (_cluster2.default.isMaster) {
    var number = forkNumber || _os2.default.cpus().length;
    var forks = [];
    for (var cursor = 0; cursor < number; cursor++) {
      forks.push(_cluster2.default.fork());
    }
    return { cluster: _cluster2.default, forks: forks };
  }
  fn();
}