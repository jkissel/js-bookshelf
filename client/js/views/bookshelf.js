"use strict";

define(['underscore', 'backbone', 'models/Book', 'module', 'jquery-ui'],
      function(_, Backbone, Book, module) {

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

  var BookView = Backbone.View.extend({
    template: _.template($('#bookshelf-tpl').html()),

    render: function() {
      this.$el.html(this.template({ book: this.model.toJSON() }));
      return this;
    }
  });

  var BookshelfView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this);
      
      this.$el.sortable();
      this.$el.disableSelection();
      
      this.listenToOnce(this.collection, 'reset', function() {
        this.listenTo(this.collection, 'add remove', this.render);
        this.render();
      }.bind(this));
    },

    render: function() {
      var items = this.collection.map(function(book) {
        return new BookView({ model: book }).render().el;
      });
    
      this.$el.empty();
      this.$el.append(items);
      
      return this;
    }
    
  });

  return { Collection: BookCollection, View: BookshelfView };
});
