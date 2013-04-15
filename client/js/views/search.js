"use strict";

define(['underscore', 'backbone', 'models/Book', 'module', 'jquery-ui'],
      function(_, Backbone, Book, module) {

  var modConfig = module.config();
  var searchBaseUri = modConfig.searchBaseUri;

  var BookCollection = Backbone.Collection.extend({
    url: searchBaseUri,
    
    parse: function(response) {
      return response.books;
    },
    
    search: function(searchTerm) {
      this.fetch({data: {text: searchTerm}, reset: true});
    }
  });

  var BookView = Backbone.View.extend({
    template: _.template($('#searchresult-tpl').html()),

    render: function() {
      this.$el.html(this.template({ book: this.model.toJSON() }));
      return this;
    }
  });

  var SearchView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this);
      
      this.listenTo(this.collection, 'reset', this.render);
    },

    render: function() {
      var items = this.collection.map(function(book) {
        return new BookView({ model: book }).render().el;
      });
    
      this.$el.empty();
      this.$el.append(items);
      
      return this;
    },
    
    events: {
      'click button': 'addBook'
    },
    
    addBook: function(evt) {
      this.trigger('select:book', this.collection.get(evt.currentTarget.dataset.id));
    }
    
  });

  return { Collection: BookCollection, View: SearchView };
});
