var _ = require('lodash');
var path = require('path');
var appDir = process.cwd();
var knex = require('knex');
var promise = require('bluebird');
var jsonfile = require('jsonfile');

var KnexDM = function() {
  var self = this;

  this._path = '';
  this._config = {};
  this._knex;

  this.path = function(p) {
    if (typeof p === 'undefined'){
      self._path = appDir;
    } else {
      self._path = p;
    }

    return self._path;
  };

  this.config = function(c) {
    if (self._path === ''){
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
  };

  this.dump = function(tables, dump_file) {
    output = {};
    return promise.each(tables, function(table) {
      // create a new table
      output[table] = [];
      
      // get all data from the table
      return self._knex.select('*').from(table).then(function(results) {
        
        // add each result to the table
        _.forEach(results, function(result) {
          output[table].push(result);
        });
      });
    })
    .then(function() {
      // remove tables that have no results
      _.forEach(output, function(value, name) {
        if (!Array.isArray(value) || value.length === 0) {
          delete output[name];
        }
      });
      
      // save & return the output
      return new promise(function(resolve, reject){
        jsonfile.writeFile(dump_file, output, function(err) {
          if (err) reject(err);

          resolve(output);
        });
      });
    });
  };

  this.load = function(dump_file) {
    return new promise(function(resolve, reject){
      jsonfile.readFile(dump_file, function(err, data) {
        if (err) reject(err);

        resolve(promise.map(_.keys(data), function(tableName) {
          return promise.map(data[tableName], function(row) {
            return self._knex.table(tableName).insert([row]);
          });
        }));
      });
    });
  };
}

module.exports = new KnexDM();