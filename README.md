# WikiCircle

[![Dependency Status](https://david-dm.org/wilfred/wikieval.svg)](https://david-dm.org/wilfred/wikieval)

This is a prototype of a metawiki. Virtually nothing works yet.

Backend is a simple node.js application with a JSON REST API. The API
design is based on
[GoCardless's API design guidelines](https://github.com/gocardless/http-api-design/blob/master/README.md).

The frontend is a single page app that should be self-hosting.

AGPLv3 license.

## Running the server

```
$ npm install
$ sudo systemctl start mongodb
$ node fresh_db.js
$ node server.js
```
