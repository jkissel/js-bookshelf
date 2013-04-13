"use strict";

require.config({
  config: {
    'bookshelf' : {
      dbBaseUri: '/couch/readinglists/',
      dbUser: 'clica',
      searchBaseUri: '/booksearch/search'
    }
  },

  paths: {
    'underscore': 'assets/underscore.min',
    'backbone': 'assets/backbone.min',
    'bootstrap': 'assets/bootstrap.min',
    'jquery-ui': 'assets/jquery-ui-1.10.2.custom.min',
    'bookshelf': 'bookshelf',
    'bookModel': 'models/Book',
    'bookCollection': 'collections/BookCollection',
    'bookView': 'views/BookView'
  },

  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'jquery-ui': {
      deps: ['jquery'],
      exports: '$'
    }
  }
});

require(['jquery', 'underscore', 'backbone', 'bookModel', 'bookshelf'], function($, _, Backbone, book, bs) {

});
