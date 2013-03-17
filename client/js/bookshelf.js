"use strict";

$(document).ready(function() {
  loadReccomendations();
  initModalDialog();
});

function loadReccomendations() {
  var $bookshelf = $('#bookshelf');
  var dataUrl = '/couch/readinglists/_design/readinglists/_view/readinglists?include_docs=true&startkey=["clica"]&endkey=["clica",{}]';

  $.ajax(dataUrl).then(requestSuccess, requestFailed);

  function requestSuccess(res) {
    $bookshelf.html(JSON.parse(res).rows.map(toBook).map(toHtml).join(''));

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

function initModalDialog() {
  var searchUrl = '/booksearch/search?text=';
  var $searchField = $('#searchDialog input[type=search]');
  var $modalBody = $('.modal-body');

  $('#searchDialog button').on('click', function(e) {
    e.preventDefault();
    var searchTerm = $searchField.val();
    var deferred = $.ajax(
      searchUrl + searchTerm
    );
    deferred.then(requestSuccess, requestFailed);

    function requestSuccess(res) {
      $modalBody.html(res);
    }

    function requestFailed(error) {
      alert('An error occured: ' + error.statusText);
    }
  });
}