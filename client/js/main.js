"use strict";

require.config({
  config: {
    'views/bookshelf' : {
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
          'views/bookshelf'], function(_, Backbone, bookshelf) {
  var bookCollection = window.books = new bookshelf.Collection();
  
  bookCollection.fetch({ reset: true });
  
  var bookshelfView = new bookshelf.View({ collection: bookCollection, el: $('#bookshelf') });
});
