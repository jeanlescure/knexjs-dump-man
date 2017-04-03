var path = require('path');
var knexdm = require('../lib/knexjs-dump-man');
var knex_dump_fixture = require('./fixtures/dump/knexfile');
var jsonfile = require('jsonfile');
var rimraf = require('rimraf');
var _ = require('lodash');

var load_dump_file = path.join(__dirname, './fixtures/load/load-dump.json');
var dump_file = path.join(__dirname, './dumps/dump-b.json');
var load_db = path.join(__dirname, './fixtures/load/test-load.db');

describe("knexjs-dump-man", function() {
  it("can load data from dumped json file into a database", function(done) {

    rimraf.sync(load_db, { disableGlob: true });
    rimraf.sync(dump_file, { disableGlob: true });

    knexdm.path(path.join(__dirname, './fixtures/load'));
    knexdm.init();
    knexdm._knex.schema
      .createTable('test_table', function(table){
        table.text('test_column');
      }).then(function(){
        return knexdm._knex.schema
          .createTable('test_table_b', function(table){
            table.text('test_column_b');
          });
      }).then(function(){
        return knexdm._knex.schema
          .createTable('test_table_c', function(table){
            table.integer('test_column_c');
          });
      }).then(function(){
        knexdm.load(load_dump_file).then(function(data){
          knexdm.dump(['test_table', 'test_table_c'], dump_file).then(function(data) {
            jsonfile.readFile(load_dump_file, function(err, file_data) {
              // Expect knex generated data to equal original file contents
              expect(data).toEqual(file_data);
              done();
            });
          });
        });
      });
  });
});