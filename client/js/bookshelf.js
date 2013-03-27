"use strict";

// tell JSHint to ignore the underscore global
/* global _ */

$(document).ready(function() {
  loadRecommendations();
  initModalDialog();
  initDragAndDrop();
});

function loadRecommendations() {
  var $bookshelf = $('#bookshelf');
  var dataUrl = '/couch/readinglists/_design/readinglists/_view/readinglists?include_docs=true&startkey=["clica"]&endkey=["clica",{}]';

  return $.ajax(dataUrl, { dataType: 'json' }).then(requestSuccess, requestFailed);

  function requestSuccess(res) {
    $bookshelf.html(renderBookshelf({ books: res.rows.map(toBook) }));
    
    //add css clear so float:left will work correctly
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
  var dataUrlBook = '/couch/readinglists/' + book.id
    , dataUrlReadingList = '/couch/readinglists/clica';

  return $.ajax(dataUrlBook, {
    contentType: 'application/json'
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
    , contentType: 'application/json'
    });
  });
}

var tplBook, tplBookshelf, currentSearchResults;

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
