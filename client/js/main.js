"use strict";

require.config({
  config: {
    'collections/BookCollection' : {
      dbBaseUri: '/couch/readinglists/',
      dbUser: 'clica',
      searchBaseUri: '/booksearch/search'
    }
  },

  paths: {
    'underscore': 'assets/underscore.min',
    'backbone': 'assets/backbone.min',
    'bootstrap': 'assets/bootstrap.min',
    'jquery-ui': 'assets/jquery-ui-1.10.2.custom.min'
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

require([
          'underscore', 
          'backbone', 
          'collections/BookCollection',
          'views/BookshelfView'], function(_, Backbone, BookCollection, BookshelfView) {
  var bookCollection = window.books = new BookCollection();
  bookCollection.fetch({ reset: true });
  
  var bookshelfView = new BookshelfView({collection: bookCollection, el: $('#bookshelf')});
});
