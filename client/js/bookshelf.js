"use strict";

// tell JSHint to ignore the underscore global
/* global _ */

/*
 ***********************
 * Init global variables
 ***********************
*/
var tplBook, tplBookshelf, currentSearchResults,
  dbBaseUri = '/couch/readinglists/', dbuser = 'clica';

var MIME_TYPE_JSON = 'application/json';

$(document).ready(function() {
  loadRecommendations();
  initModalDialog();
  initDragAndDrop();

  addDeleteButtons();
});

function loadRecommendations() {
  var $bookshelf = $('#bookshelf');
  var dataUrl = 
    dbBaseUri
    + '_design/readinglists/_view/readinglists'
    + '?include_docs=true&startkey=["'
    + dbuser + '"]&endkey=["' + dbuser
    + '",{}]';

  return $.ajax(dataUrl, { dataType: 'json' }).then(requestSuccess, requestFailed);

  function requestSuccess(res) {
    $bookshelf.html(renderBookshelf({ books: res.rows.map(toBook) }));
    
    //add css clear so float:left will work properly
    $bookshelf.append('<div class="clear"></div>');
    
    function toBook(row) {
      return row.doc;
    }
  }

  function requestFailed(error) {
    console.log(error);
  }
}

function addBookToRecommendations(book) {
  var dataUrlBook = dbBaseUri + book.id
    , dataUrlReadingList = dbBaseUri + dbuser;

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
  var searchUrl = '/booksearch/search?text=';
  var $searchField = $('#searchDialog input[type=search]');
  var $table = $('.modal-body tbody');

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

function initDragAndDrop() {
  var $bookshelf = $('#bookshelf');

  $bookshelf.sortable(); //activate sortable nature
  $bookshelf.disableSelection(); //disable text selection
}

function addDeleteButtons() {
  var $bookshelf = $('#bookshelf');

  $bookshelf.children(function(listItem) {
    listItem.find('a').append('<i class="icon-trash"></i>');
  });
}