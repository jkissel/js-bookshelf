"use strict";

define('bookView',
       ['backbone',
        'undescore',
        'bookCollection'],
      function(Backbone, _, bookCollection) {

  var BookView = Backbone.View.extend({
    template: _.template(…),

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  return BookView;
});