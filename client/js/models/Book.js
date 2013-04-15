"use strict";
//a book can come from search or couch!!
define(['backbone',
        'underscore',
        'module'],
      function(Backbone, _, module) {

  var Book = Backbone.Model.extend({
    idAttribute: '_id'
  });

  return Book;
});
