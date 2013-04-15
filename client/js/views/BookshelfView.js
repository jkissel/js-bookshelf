"use strict";

define(['backbone', 'underscore', 'jquery-ui'],
      function(Backbone, _) {

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

  return BookshelfView;
});
