var path = require('path');
var knexdm = require('../lib/knexjs-dump-man');
var knex_dump_fixture = require('./fixtures/dump/knexfile');

describe("knexjs-dump-man", function() {
  beforeEach(function() {
    knexdm.path(path.join(__dirname, './fixtures/dump'));
    knexdm.init();
  });

  it("can read a knexfile.js file", function() {
    expect(knexdm.config()).toEqual(knex_dump_fixture);
  });

  // it("can dump a database into a json file", function() {
  //   knexdm.dump();
  //   expect(true).toEqual(false); // Would like to see a test dump to know what to look for...
  // });
});