$(document).ready(function() {
  var $searchField = $('#searchDialog input[type=search]');
  var $modalBody = $('.modal-body');

  $('#searchDialog button').on('click', function(e) {
    e.preventDefault();
    var searchTerm = $searchField.val();
    var deferred = $.ajax(
      'http://www.michhost.de:3000/search?text=' + searchTerm
    );
    deferred.then(requestSuccess, requestFailed);

    function requestSuccess(res) {
      $modalBody.html(res);
    }

    function requestFailed(error) {
      alert('An error occured: ' + error.statusText);
    }
  });
});