<img src="binary_files/ouroboros.jpg" align="right"/>

# Metawiki [![Build Status](https://travis-ci.org/Wilfred/metawiki.svg?branch=master)](https://travis-ci.org/Wilfred/metawiki) [![Dependency Status](https://david-dm.org/wilfred/metawiki.svg)](https://david-dm.org/wilfred/metawiki) [![Coverage Status](https://coveralls.io/repos/Wilfred/metawiki/badge.svg)](https://coveralls.io/r/Wilfred/metawiki) [![Code Climate](https://codeclimate.com/github/Wilfred/metawiki/badges/gpa.svg)](https://codeclimate.com/github/Wilfred/metawiki)

Demo site: http://metawiki-demo.wilfred.me.uk/

This is a proof of concept self-hosting metawiki. It has basic
self-editing functionality but no concept of users or history yet.

The backend is a simple node.js application with a JSON REST API. The
API design is based on
[GoCardless's API design guidelines](https://github.com/gocardless/http-api-design/blob/master/README.md). The
frontend is a single page app.

AGPLv3 license. Ouroboros image is [under CC-NC-ND license](https://www.flickr.com/photos/vaxzine/3389513720).

## Running the server

```
# Install the dependencies.
$ npm install -g yarn
$ yarn

# Start a database for the backend.
$ sudo systemctl start mongodb
# if mongo didn't shut down cleanly:
$ sudo -u mongodb bash -c "mongod --repair --dbpath /var/lib/mongodb"

# Populate the database and start the server.
$ npm run load-db
$ npm start
```

## Tests

We have a handful of backend tests. You will need to have a mongodb
instance running.

```
$ export PATH=$PATH:node_modules/.bin
$ npm test
```
