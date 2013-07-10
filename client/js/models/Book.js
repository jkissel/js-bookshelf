"use strict";
//a book can come from search or couch!!
define('book',
       ['backbone',
        'underscore',
        'dbConfig',
        'searchConfig'],
      function(Backbone, _, dbConfig, searchConfig) {

  var Book = Backbone.Model.extend({

  });

  return Book;
});
