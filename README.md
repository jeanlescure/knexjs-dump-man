# Knexjs Dump Manager (knexdm)

Dump manager for KnexJS. Making it easy to migrate databases agnostically using NodeJS.

# Installing

This is meant to be used as a global module:

`$ npm install -g knexjs-dump-man`

# Dumping a database

In a folder containing a `knexfile.js` run the following: 

`$ knexdm --dump mydump.json --tables first_table,second_table,[...]`

# Loading a dump file into database

In a folder containing a `knexfile.js` run the following: 

`$ knexdm --load mydump.json`

# Caveats

**Currently, this package is unable to export or assume table schemas.**

In order to be able to load a dump you need to have your tables already created with their respective schemas in place.

Be sure to check out the tests provided for loading a dump (`spec/load-spec.js`) for further details.

# TODO

- Add a way to **dump** typed table schemas
- Add a way to **load** typed table schemas
- Add better error catching