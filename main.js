#!/usr/bin/env node
var knexdm = require('./lib/knexjs-dump-man');
var program = require('commander');
var loadingSpinner = require('loading-spinner');
 
function list(val) {
  return val.split(',');
}

function graceful_death(msg) {
  console.error(msg);
  process.exit(1);
}

function err_handler(e) {
  console.error(e);
  process.exit();
}

// Customize the spinner sequence
loadingSpinner.setSequence(
  ['≑','≒','≑','≓']
);
 
program
  .version('0.9.3')
  .option('-d, --dump [json-file-name]', 'Generate dump file with name [json-file-name]')
  .option('-t, --tables <tables-list>', 'Use with \'-d\' to list which tables you want to dump', list)
  .option('-l, --load [json-file-name]', 'Load dump file with name [json-file-name] into database')
  .parse(process.argv);

// knexdm -d test.json -l test.json
if (program.dump && program.load) graceful_death('Cannot Dump and Load! (-d and -l options cannot be combined)');
// knexdm -l test.json -t table_a,table_b
if (program.load && program.tables) graceful_death('Tables specified on Load! (-t option must be used exclusively along with -d option)');
// knexdm -d test.json
if (program.dump && typeof(program.tables)==='undefined') graceful_death('No Tables specified! (-d option requires -t option)');

knexdm.init();

if (program.dump)  {
  // knexdm -d test.json -t table_a,table_b
  console.log('Dumping tables', program.tables, 'into dump file:', program.dump);

  // Start the loading spinner
  loadingSpinner.start( 250, { clearChar:  true } );

  knexdm.dump(program.tables, program.dump).then(function(data) {
    // Stop the loading spinner
    loadingSpinner.stop();

    console.log('Done!');

    process.exit();
  }).catch(err_handler);
}else if(program.load){
  // knexdm -l test.json
  console.log('Loading data from dump file:', program.load);

  // Start the loading spinner
  loadingSpinner.start( 250, { clearChar:  true } );

  knexdm.load(program.load).then(function(data){
    // Stop the loading spinner
    loadingSpinner.stop();

    console.log('Done!');

    process.exit();
  }).catch(err_handler);
}

