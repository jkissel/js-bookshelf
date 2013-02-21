#!/usr/bin/node

"use strict";

var fs = require('fs');
var configFile = 'conf/config.json';

var express = require('express');
var app = express();

var util = require('util');
var OperationHelper = require('json-apac').OperationHelper;
var encoding = 'UTF-8';

var config = readConfigFromFile(configFile, encoding);

var opHelper = new OperationHelper({
  awsId:     config.awsId,
  awsSecret: config.awsSecret,
  assocId:   null
});

/*
 *******************
 * Server
 *******************
*/

//search for a text string and return all matches with images
app.get("/search", function(req, res) {
  var text = req.query.text;
  
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': text,
    'ResponseGroup': 'ItemAttributes,Images'
  }, function(statusCode, response) {
    if (statusCode) {
      console.log('Error: ' + statusCode + '\n');
      res.end();
    } else {
      var obj = JSON.parse(response).ItemSearchResponse.Items;
      var output = "", imgUrl = "";

      if (!obj.Request.IsValid) {
        console.log('Invalid request: ' + obj.Request + '\n');
        res.end();
      } else {
        output = obj.Item.map(function(item) {
          imgUrl = (item.MediumImage === undefined ? '' : item.MediumImage.URL);

          return '<li><a href="' + item.DetailPageURL + '">' + 
            item.ItemAttributes.Title + '</a> (' + 
            item.ASIN + ') --&gt; ' +
            '<img src="' + imgUrl + '" /></li>';
        });

        res.setHeader("Content-Type", "text/html");        
        res.end('<html><head><title>Result</title></head><body>\n' +
          '<h1>Found items:</h1>\n' + 
          '<ul>' + output.join('<br />\n') + 
          '</ul>\n' +
          '</body></html>'
          , encoding);
      }
    }
  });
});

//get a specific item by ASIN id and return the image
app.get("/search/item/:id", function(req, res) {
  var id = req.params.id;
  
  opHelper.execute('ItemLookup', {
    'ItemId': id,
    'IdType': 'ASIN',
    'ResponseGroup': 'Images'
  }, function(statusCode, response) {
    if (statusCode) {
      console.log('Error: ' + statusCode + '\n');
      res.end();
    } else {
      var obj = JSON.parse(response).ItemLookupResponse.Items;
      var imgUrl = "";

      if (!obj.Request.IsValid) {
        console.log('Invalid request: ' + obj.Request + '\n');
        res.end();
      } else {
        imgUrl = (obj.Item.MediumImage === undefined ? '' : obj.Item.MediumImage.URL);
        res.end(imgUrl, encoding);
      }
    }
  });
});

app.listen(3000);

/*
 *******************
 * Utility methods
 *******************
*/

function readConfigFromFile(configFile, encoding) {
  var fileContent = fs.readFileSync(configFile, encoding);
  var fileAsObj;

  if (fileContent) {
    fileAsObj = JSON.parse(fileContent);

    if (!fileAsObj.awsId || !fileAsObj.awsSecret) {
      throw new Error("Either awsId or awsSecret could not be read from the config file");
    }
  } else {
    throw new Error("File " + configFile + " could not be read");
  }
  return fileAsObj;
}