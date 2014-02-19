var assert = require('assert');
var cb = require('assert-called');
var Bender = require('bender-crdt');
var bender = new Bender({ ttl: 1 });
var createPool = require('../');

var app = {
  app: 'hello-world',
  version: '1.0.0',
  host: '127.0.0.1',
  port: 9000
};

var c = { foo: 'bar' };

function connect(reg, cb) {
  assert.equal(reg.app, app.app, 'registration should be passed to connect handler');
  cb(null, c);
}

function disconnect(reg, conn, cb) {
  assert.equal(reg.app, app.app, 'registration should be passed to disconnect handler');
  assert.equal(conn, c, 'pool item should be passed to disconnect handler');
}

var pool = createPool({
  bender: bender,
  connect: cb(connect),
  disconnect: cb(disconnect)
});
var appReg = bender.register(app);
