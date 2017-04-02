# Knexjs Dump Manager

Dump manager for KnexJS. Making it easy to migrate databases agnostically using NodeJS.

# Dumping a database

In a folder containing a `knexfile.js` run the following: 

`knexdm --dump mydump.json`

# Loading a dump file into database

In a folder containing a `knexfile.js` run the following: 

`knexdm --load mydump.json`