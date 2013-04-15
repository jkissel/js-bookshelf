"use strict";

define(['backbone',
        'underscore',
        'module',
        'models/Book'],
      function(Backbone, _, module, Book) {
  var modConfig = module.config();
  var dbBaseUri = modConfig.dbBaseUri,
      dbUser = modConfig.dbUser,
      dataUrl = dbBaseUri
          + '_design/readinglists/_view/readinglists'
          + '?include_docs=true&startkey=["'
          + dbUser + '"]&endkey=["' + dbUser
          + '",{}]';

  var BookCollection = Backbone.Collection.extend({
    model: Book,
    url: dataUrl,
    
    parse: function(response) {
      return response.rows.map(toBook);

      function toBook(row) {
        return row.doc;
      }
    }
  });

  return BookCollection;
});
