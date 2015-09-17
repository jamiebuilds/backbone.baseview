import _ from 'underscore';
import Backbone from 'backbone';

const BaseView = Backbone.View.extend({
  constructor(options = {}) {
    if (options.template) {
      this.template = options.template;
    }
    Backbone.View.apply(this, arguments);
  },

  $(selector) {
    return Backbone.$(this._querySelector(selector));
  },

  compile() {
    if (!this.template) {
      return;
    }
    var data = this.serializeData();
    return this.template(data);
  },

  render() {
    if (this._isRemoved) {
      throw new Error('Views cannot be rendered after they have been removed.');
    }

    var html = this.compile();
    if (html === this._getInnerHTML()) {
      return this;
    }

    var parentNode = this._getParentNode();
    var nextSibling = this._getNextSibling();
    if (parentNode && this._isAttached) {
      this.detach();
    }

    this._setInnerHTML(html);

    this._regions = _.result(this, 'regions');
    if (parentNode && !this._isAttached) {
      this.attach(parentNode, nextSibling);
    }

    this._isRendered = true;
    this.trigger('render');
    return this;
  },

  attach(parentNode, nextSibling) {
    if (this._isRemoved) {
      throw new Error('Views cannot be attached after they have been removed.');
    }
    if (this._isAttached) {
      return this;
    }
    if (nextSibling) {
      this._insertBefore(parentNode, nextSibling);
    } else {
      this._appendChild(parentNode);
    }
    this._isAttached = true;
    this.trigger('attach');
    return this;
  },

  detach() {
    if (this._isRemoved) {
      throw new Error('Views cannot be detached after they have been removed.');
    }
    if (!this._isAttached) {
      return this;
    }
    this._detach();
    this._isAttached = false;
    this.trigger('detach');
    return this;
  },

  remove() {
    if (this._isRemoved) {
      throw new Error('Views cannot be removed more than once.');
    }
    this.detach(this.el);
    this._setInnerHTML('');
    this.stopListening();
    delete this.el;
    delete this.$el;
    this._isRendered = false;
    this._isRemoved = true;
    this.trigger('remove');
    return this;
  },

  serializeData() {
    if (this.model) {
      return this.serializeModel(this.model);
    } else if (this.collection) {
      return this.serializeCollection(this.collection);
    }
  },

  serializeModel(model) {
    return _.clone(model.attributes);
  },

  serializeCollection(collection) {
    return {
      collection: _.map(collection.models, this.serializeModel, this)
    };
  },

  isRendered() {
    return this._isRendered === true;
  },

  isRemoved() {
    return this._isRemoved === true;
  },

  isAttached() {
    return this._isAttached === true;
  },

  _querySelector(selector) {
    return this.el.querySelector(selector);
  },

  _getInnerHTML() {
    return this.el.innerHTML;
  },

  _setInnerHTML(innerHTML) {
    this.el.innerHTML = innerHTML;
  },

  _getParentNode() {
    return this.el.parentNode;
  },

  _getNextSibling() {
    return this.el.nextSibling;
  },

  _insertBefore(parentNode, nextSibling) {
    return parentNode.insertBefore(this.el, nextSibling);
  },

  _appendChild(parentNode) {
    return parentNode.appendChild(this.el);
  },

  _detach() {
    return this._remove();
  },

  _remove() {
    if (this.el.remove) {
      this.el.remove();
    } else {
      var parentNode = this._getParentNode();
      parentNode.removeChild(this.el);
    }
  }
}, {
  isView(value) {
    return !!value && (
      value instanceof BaseView ||
      value.prototype instanceof BaseView
    );
  }
});

export default BaseView;
