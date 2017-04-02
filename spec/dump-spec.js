var path = require('path');
var knexdm = require('../lib/knexjs-dump-man');
var knex_dump_fixture = require('./fixtures/dump/knexfile');
var jsonfile = require('jsonfile');

var dump_file = path.join(__dirname, './dumps/dump.json');

describe("knexjs-dump-man", function() {
  beforeEach(function() {
    knexdm.path(path.join(__dirname, './fixtures/dump'));
    knexdm.init();
  });

  it("can read a knexfile.js file", function() {
    expect(knexdm.config()).toEqual(knex_dump_fixture);
  });

  it("can dump selected tables from database into a json file", function(done) {
    knexdm.dump(['test_table', 'test_table_c'], dump_file).then(function(data) {
      jsonfile.readFile(dump_file, function(err, file_data) {
        // Expect knex generated data to equal file contents
        expect(data).toEqual(file_data);

        // Sanity check...
        expect(file_data['test_table'][2]['test_column']).toEqual('vbfwfgiepay8a3vok');
        expect(file_data['test_table'][96]['test_column']).toEqual('52tkt17newejah58');
        expect(file_data['test_table_c'][16]['test_column_c']).toEqual(91537069);
        expect(file_data['test_table_b']).not.toBeDefined();
        done();
      });
    });
  });
});