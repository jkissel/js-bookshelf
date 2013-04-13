"use strict";

define('bookCollection',
       ['backbone',
        'undescore',
        'book'],
      function(Backbone, _, book) {

  var BookCollection = Backbone.Collection.extend({
    model: book
  });

  return BookCollection;
});