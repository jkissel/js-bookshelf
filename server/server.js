#!/usr/bin/node

'use strict';

/*
 *******************
 * Init
 *******************
*/

var util = require('util');
var fs = require('fs');
var express = require('express');

//constants
var CONTENT_TYPE_HEADER = 'Content-Type';
var MIME_TYPE_JSON = 'application/json';
var MIME_TYPE_HTML = 'text/html';
var ENCODING = 'UTF-8';
var CONFIG_FILE_URL = 'conf/config.json';

var config = readConfigFromFile(CONFIG_FILE_URL, ENCODING);
var app = express();
var OperationHelper = require('json-apac').OperationHelper;

var opHelper = new OperationHelper({
  awsId:     config.awsId,
  awsSecret: config.awsSecret,
  assocId:   config.partnerId,
  endPoint:  config.endPoint
});

/*
 *******************
 * Server
 *******************
*/

/* search for a text string and return all matches with images */
app.get('/search', function(req, res) {
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
      var output = '', imgUrl = '';

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

        res.setHeader(CONTENT_TYPE_HEADER, MIME_TYPE_HTML);        
        res.end('<html><head><title>Result</title></head><body>\n' +
          '<h1>Found items:</h1>\n' + 
          '<ul>' + output.join('<br />\n') + 
          '</ul>\n' +
          '</body></html>'
          , ENCODING);
      }
    }
  });
});

/* get a specific item by ASIN id and return the image */
app.get('/search/item/:id', function(req, res) {
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
      var imgUrl = '';

      if (!obj.Request.IsValid) {
        console.log('Invalid request: ' + obj.Request + '\n');
        res.end();
      } else {
        imgUrl = (obj.Item.MediumImage === undefined ? '' : obj.Item.MediumImage.URL);
        res.setHeader(CONTENT_TYPE_HEADER, MIME_TYPE_HTML);
        res.end(imgUrl, ENCODING);
      }
    }
  });
});

/* load all books of a certain user from the server */
app.get('/:user/images', function(req, res) {
  var user = req.param('user');
  
  //query database

  //return result as json
  var result = {
    "user": "clica",
    "recommendations": [
      {
        "title": "The Odyssey",
        "author": "Homer",
        "asin": "1613823398",
        "imageMedium": "http://ecx.images-amazon.com/images/I/51-C0PTzTSL._SL160_.jpg",
        "amazonLink": "http://www.amazon.com/The-Odyssey-Homer/dp/1613823398%3FSubscriptionId%3DAKIAI3LDQOZKHLBWPCMQ%26tag%3Dnull%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D1613823398"
      },
      {
        "title": "The BRO Code",
        "author": "Barney Stinson",
        "asin": "143911000X",
        "imageMedium": "http://ecx.images-amazon.com/images/I/51w81FQD6oL._SL160_.jpg",
        "amazonLink": "http://www.amazon.com/The-Bro-Code-Barney-Stinson/dp/143911000X%3FSubscriptionId%3DAKIAI3LDQOZKHLBWPCMQ%26tag%3Dnull%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D143911000X"
      }
    ],
    "readingList": []
  }
  
  res.setHeader(CONTENT_TYPE_HEADER, MIME_TYPE_JSON);        
  res.end(JSON.stringify(result), ENCODING);
});

//todo: 
/* add a book to reccomendations */
/* remove a book from reccomendations */

app.listen(3000);

/*
 *******************
 * Utility methods
 *******************
*/

function readConfigFromFile(file) {
  var fileContent = fs.readFileSync(file, ENCODING);
  var fileAsObj;

  if (fileContent) {
    fileAsObj = JSON.parse(fileContent);

    if (!fileAsObj.awsId || !fileAsObj.awsSecret) {
      throw new Error('Either awsId or awsSecret could not be read from the config file');
    }
  } else {
    throw new Error('File ' + file + ' could not be read');
  }
  return fileAsObj;
}