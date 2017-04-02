var path = require('path');
var appDir = path.dirname(require.main.filename);
var knex = require('knex');
var schemer = require('knex-schemer');

var KnexDM = function() {
  var self = this;

  this._path = '';
  this._config = {};
  this._knex;
  this._schemer;

  this.path = function(p) {
    if (typeof p === 'undefined'){
      self._path = appDir;
    } else {
      self._path = p;
    }

    return self._path;
  }

  this.config = function(c) {
    if (typeof self._path === 'undefined'){
      self.path();
    }

    if (typeof c === 'undefined'){
      self._config = require(path.join(self._path, 'knexfile.js'));
    } else {
      self._config = c;
    }

    return self._config;
  };

  this.init = function() {
    self.config();
    self._knex = knex(self._config);
    self._schemer = schemer(self._knex);
  }

  this.dump = function() {
    // stub
  }
  
  this.load = function() {
    // stub
  }
}

module.exports = new KnexDM();