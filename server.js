#!/usr/bin/node

var express = require('express')
var app = express();

var util = require('util'),
    OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
    awsId:     'AKIAIFMXF2YDHSUITRBA',
    awsSecret: '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',
    assocId:   null
});

app.get("/test", function(req, res) {
  res.end("test");
});

app.get("/search", function(req, res) {
  var text = req.query.text;
  
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': text,
    'ResponseGroup': 'ItemAttributes'
  }, function(error, results) {
    if (error) {
      console.log('Error: ' + error + '\n');
      res.end();
    }
    
    var ASINs = results.ItemSearchResponse.Items[0].Item.map(function(item) {
      return item.ASIN;
    });
    
    res.end('Found ASINs:\n' + ASINs.join('\n') + '\n');
  });
});

app.listen(3000);

