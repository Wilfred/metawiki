![screenshot](binary_files/ouroboros.jpg)

# Metawiki

[![Build Status](https://travis-ci.org/Wilfred/wikicircle.svg?branch=master)](https://travis-ci.org/Wilfred/wikicircle)
[![Dependency Status](https://david-dm.org/wilfred/wikicircle.svg)](https://david-dm.org/wilfred/wikicircle)

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
# specifying --python is only necessary if python 3 is the default
$ npm install --python=/usr/bin/python2
$ sudo systemctl start mongodb

# if mongo didn't shut down cleanly:
$ sudo -u mongodb bash -c "mongod --repair --dbpath /var/lib/mongodb"

$ npm run load-db
$ npm start
```

## Tests

We have a handful of backend tests, which you can run with:

```
$ export PATH=$PATH:node_modules/.bin
$ npm run test
```
