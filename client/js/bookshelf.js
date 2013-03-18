"use strict";

// tell JSHint to ignore the underscore global
/* global _ */

$(document).ready(function() {
  loadReccomendations();
  initModalDialog();
});

function loadReccomendations() {
  var $bookshelf = $('#bookshelf');
  var dataUrl = '/couch/readinglists/_design/readinglists/_view/readinglists?include_docs=true&startkey=["clica"]&endkey=["clica",{}]';

  $.ajax(dataUrl, { dataType: 'json' }).then(requestSuccess, requestFailed);

  function requestSuccess(res) {
    $bookshelf.html(res.rows.map(toBook).map(toHtml).join(''));

    function toBook(row) {
      return row.doc;
    }

    function toHtml(book) {
      return '<li><a href="' + book.amazonLink + '">'
           +   '<img src="' + book.imageMedium + '" />'
           + '</a></li>';
    }
  }

  function requestFailed(error) {
    console.log(error);
  }
}

var tplBook;

function renderBook(data) {
  if (! tplBook) {
    tplBook = _.template($('#book-tpl').text());
  }

  return tplBook(data);
}

function initModalDialog() {
  var searchUrl = '/booksearch/search?text=';
  var $searchField = $('#searchDialog input[type=search]');
  var $table = $('.modal-body tbody');

  $('#searchDialog button').on('click', function(e) {
    e.preventDefault();

    var searchTerm = $searchField.val();

    $.ajax(searchUrl + searchTerm, { dataType: 'json' })
        .then(requestSuccess, requestFailed);

    function requestSuccess(res) {
      console.log(res);
      $table.html(renderBook(res));
    }

    function requestFailed(error) {
      window.alert('An error occured: ' + error.statusText);
    }
  });
}
