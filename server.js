#!/usr/bin/node

var fs = require('fs');
var configFile = 'conf/config.json';

var express = require('express')
var app = express();

var util = require('util'),
    OperationHelper = require('apac').OperationHelper;

//read config from file
var config = fs.readFileSync(configFile, 'UTF-8');
var aws_id, aws_secret;
if (config) {
  config = JSON.parse(config);
  aws_id = config.awsId;
  aws_secret = config.awsSecret;

  if (!aws_id || !aws_secret) {
    throw new Error("Either awsId or awsSecret could not be read from config file");
  }
} else {
  throw new Error("File " + configFile + " could not be read");
}

var opHelper = new OperationHelper({
    awsId:     aws_id,
    awsSecret: aws_secret,
    assocId:   null
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

