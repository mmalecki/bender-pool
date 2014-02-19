var net = require('net');
var createPool = require('../');
var Bender = require('bender-crdt');

var bender = new Bender({ ttl: 1000 });
var pool = createPool({
  bender: bender,
  connect: net.connect,
  // Registration object comes with `host` and `port` properties, so passing
  // `net.connect` there will just work
  disconnect: function (reg, conn) {
    conn.end();
  }
});

var server = net.createServer(function (sock) {
  console.log('Got a connection');
  sock.pipe(sock);
}).listen(0, function () {
  bender.startRegistering({
    app: 'pool-example',
    version: '0.0.0',
    host: '127.0.0.1',
    port: server.address().port
  });
});
