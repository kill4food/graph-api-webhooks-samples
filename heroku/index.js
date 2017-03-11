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
console.log(JSON.stringify(req.body));
  if (req.isXHub) {
    if (req.isXHubValid()) {
      if(req.body.object == 'page') {
        var entry = req.body.entry;
        entry.forEach(function(userEntry) {
          entry.changes.forEach(function(change) {
            var value = change.value;
            if(change.field == 'field' && value.item == 'like' && value.verb == 'add') {
              console.log('The user ' + value.user_id + ' has liked the page ' + change.id);
            } else {
              console.log('there is not a like update');
              console.log(JSON.stringify(req.body));
            } // end of values check
          });
          var x = arrayItem.prop1 + 2;
        });
      } else {
        console.log('this is not a page entry');
        console.log(JSON.stringify(req.body));
      } // end of page check
    } // end of isXHubValid
  } // end of isXHub
  else {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.send('Failed to verify!\n');
    // recommend sending 401 status in production for non-validated signatures
    // res.sendStatus(401);
  }
  //console.log(req.body);

  // Process the Facebook updates here
  res.sendStatus(200);
});

app.listen();
