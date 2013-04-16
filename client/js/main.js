"use strict";

require.config({
  config: {
    'views/bookshelf': {
      dbBaseUri: '/couch/readinglists/',
      dbUser: 'clica'
    },
    'views/search': {
      searchBaseUri: '/booksearch/search'
    }
  },

  paths: {
    'underscore': 'assets/underscore',
    'backbone': 'assets/backbone',
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
          'views/bookshelf',
          'views/search'], function(_, Backbone, bookshelf, search) {
  var bookCollection = new bookshelf.Collection();

  bookCollection.fetch({ reset: true });

  var bookshelfView = new bookshelf.View({ collection: bookCollection, el: $('#bookshelf') });

  var searchCollection = new search.Collection();
  var searchView = new search.View({ collection: searchCollection, el: $('.modal-body tbody')});

  var $searchField = $('#searchDialog input[type=search]');
  $('#searchButton').on('click', function(e) {
    e.preventDefault();

    var searchTerm = $searchField.val();

    searchCollection.search(searchTerm);
  });

  searchView.on('select:book', function(book) {
    $('#searchDialog').modal('hide');

    bookCollection.add(book);
  });
});
