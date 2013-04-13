"use strict";

// tell JSHint to ignore the underscore global
/* global _ */

define('bookshelf',
       ['jquery',
        'underscore',
        'module',
        'jquery-ui'], function($, _, module) {
  var tplBook,
      tplBookshelf,
      currentSearchResults,
      dbBaseUri = module.config().dbBaseUri,
      dbUser = module.config().dbUser,
      searchBaseUri = module.config().searchBaseUri,
      MIME_TYPE_JSON = 'application/json',
      $bookshelf = $('#bookshelf');

  loadRecommendations($bookshelf);
  initModalDialog();
  initDragAndDrop($bookshelf);
  addDeleteButtons($bookshelf);

  function loadRecommendations($bookshelf) {
    var dataUrl = dbBaseUri
      + '_design/readinglists/_view/readinglists'
      + '?include_docs=true&startkey=["'
      + dbUser + '"]&endkey=["' + dbUser
      + '",{}]';

    return $.ajax(dataUrl, { dataType: 'json' }).then(requestSuccess, requestFailed);

    function requestSuccess(res) {
      $bookshelf.html(renderBookshelf({ books: res.rows.map(toBook) }));

      function toBook(row) {
        return row.doc;
      }
    }

    function requestFailed(error) {
      console.log('An error occured during book fetching:', error);
      //let's add some dummy books nonetheless
      var dummyBookList = {
                            books: [
                              {
                                amazonLink: '#',
                                imageMedium: 'img/samples/hamlet.jpg'
                              },
                              {
                                amazonLink: '#',
                                imageMedium: 'img/samples/homer.jpg'
                              },
                              {
                                amazonLink: '#',
                                imageMedium: 'img/samples/odyssey.jpg'
                              }
                            ]
                          };
      $bookshelf.html(renderBookshelf(dummyBookList));
    }

    //add css clear so float:left will work properly
    $bookshelf.append('<div class="clear"></div>');
  }

  function addBookToRecommendations(book) {
    var dataUrlBook = dbBaseUri + book.id
      , dataUrlReadingList = dbBaseUri + dbUser;

    return $.ajax(dataUrlBook, {
      contentType: MIME_TYPE_JSON
    , type: 'PUT'
    , data: JSON.stringify(book)
    , processData: false
    }).then(function() {
      return $.ajax(dataUrlReadingList, { dataType: 'json' });
    }).then(function(readingList) {
      readingList.books.push({'id': book.id + '' });

      return $.ajax(dataUrlReadingList, {
        type: 'PUT'
      , data: JSON.stringify(readingList)
      , contentType: MIME_TYPE_JSON
      });
    });
  }

  function renderBookshelf(data) {
    if (! tplBookshelf) {
      tplBookshelf = _.template($('#bookshelf-tpl').text());
    }

    return tplBookshelf(data);
  }

  function renderBook(data) {
    if (! tplBook) {
      tplBook = _.template($('#searchresult-tpl').text());
    }

    return tplBook(data);
  }

  function initModalDialog() {
    var searchUrl = searchBaseUri + '?text=',
        $searchField = $('#searchDialog input[type=search]'),
        $table = $('.modal-body tbody');

    $('#searchButton').on('click', function(e) {
      e.preventDefault();

      var searchTerm = $searchField.val();

      $.ajax(searchUrl + searchTerm, { dataType: 'json' })
          .then(requestSuccess, requestFailed);

      function requestSuccess(res) {
        currentSearchResults = _.object(_.pluck(res.books, 'id'), res.books);
        $table.html(renderBook(res));
      }

      function requestFailed(error) {
        window.alert('An error occured: ' + error.statusText);
      }
    });

    $table.on('click', 'button', function(evt) {
      var book = currentSearchResults[$(this).data('id')];
      addBookToRecommendations(book).then(loadRecommendations).then(function() {
        $('#searchDialog').modal('hide');
      });
    });
  }

  function initDragAndDrop($bookshelf) {
    $bookshelf.sortable();
    $bookshelf.disableSelection();
  }

  function addDeleteButtons($bookshelf) {
    $bookshelf.children(function(listItem) {
      listItem.find('a').append('<i class="icon-trash"></i>');
    });
  }
});