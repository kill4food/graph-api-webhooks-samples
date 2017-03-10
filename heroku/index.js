/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log(req);
  res.send('It works!');
});

app.get(['/facebook', '/instagram'], function(req, res) {
  if (
    req.param('hub.mode') == 'subscribe' &&
    req.param('hub.verify_token') == 'token'
  ) {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
var print = function( o, maxLevel, level ) {
    if ( typeof level == "undefined" ) {
        level = 0;
    }
    if ( typeof level == "undefined" ) {
        maxLevel = 0;
    }

    var str = '';
    // Remove this if you don't want the pre tag, but make sure to remove
    // the close pre tag on the bottom as well
    if ( level == 0 ) {
        str = '<pre>';
    }

    var levelStr = '';
    for ( var x = 0; x < level; x++ ) {
        levelStr += '    ';
    }

    if ( maxLevel != 0 && level >= maxLevel ) {
        str += levelStr + '...</br>';
        return str;
    }

    for ( var p in o ) {
        if ( typeof o[p] == 'string' ) {
            str += levelStr +
                p + ': ' + o[p] + ' </br>';
        } else {
            str += levelStr +
                p + ': { </br>' + print( o[p], maxLevel, level + 1 ) + levelStr + '}</br>';
        }
    }

    // Remove this if you don't want the pre tag, but make sure to remove
    // the open pre tag on the top as well
    if ( level == 0 ) {
        str += '</pre>';
    }
    return str;
};
console.log(print(req));

  if (req.isXHub) {
    console.log('request header X-Hub-Signature found, validating');
    if (req.isXHubValid()) {
      console.log('request header X-Hub-Signature validated');
      res.send('Verified!\n');
    }
  }
  else {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.send('Failed to verify!\n');
    // recommend sending 401 status in production for non-validated signatures
    // res.sendStatus(401);
  }
  console.log(req.body);

  // Process the Facebook updates here
  res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  res.sendStatus(200);
});

app.listen();
