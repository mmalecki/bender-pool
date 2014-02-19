var assert = require('assert');
var Bender = require('bender-crdt');
var bender = new Bender({ ttl: 1 });
var createPool = require('../');

assert.throws(function () {
  createPool();
});

assert.throws(function () {
  createPool({});
});

assert.throws(function () {
  createPool({
    connect: function () {},
    disconnect: function () {}
  });
});

assert.doesNotThrow(function () {
  createPool({
    bender: bender,
    connect: function () {},
    disconnect: function () {}
  });
});
