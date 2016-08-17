'use strict';

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _server2.default(function (app) {
  app.set('port', 5010).use(function (req, res) {
    res.send('hello');
  });
}, { cluster: 4 });