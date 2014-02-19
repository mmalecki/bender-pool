var EE = require('events').EventEmitter;

module.exports = function (options) {
  var bender = options.bender;
  var connect = options.connect;
  var disconnect = options.disconnect;

  if (!options ||
      typeof options.connect !== 'function' ||
      typeof options.disconnect !== 'function' ||
      !options.bender) {
    throw new Error('`options.connect`, `options.disconnect` and `options.bender` are required');
  }

  var ee = new EE();
  var regs = [];
  var conns = [];

  bender.on('online', function (reg) {
    regs.push(reg);
    ee.emit('connecting', reg);
    connect(reg, function (err, conn) {
      if (err) {
        return;
      }
      regs.push(conn);
      conns.push(conn);
      ee.emit('connected', reg, conn);
    });
  });

  bender.on('offline', function (reg) {
    var conn, index;

    index = regs.indexOf(reg);
    conn = conns[index];

    ee.emit('disconnecting', reg, conn);
    disconnect(reg, conn, function (err) {
      if (err) {
        return;
      }

      // Redo the search since `disconnect` is asynchronous
      index = regs.indexOf(reg);
      regs.splice(index, 1);
      conns.splice(index, 1);
      ee.emit('disconnected', reg, conn);
    });
  });

  return ee;
};
