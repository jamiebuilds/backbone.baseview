# backbone.baseview

A simple BaseView for Backbone.

[![Travis build status](http://img.shields.io/travis/thejameskyle/backbone.baseview.svg?style=flat)](https://travis-ci.org/thejameskyle/backbone.baseview)
[![Code Climate](https://codeclimate.com/github/thejameskyle/backbone.baseview/badges/gpa.svg)](https://codeclimate.com/github/thejameskyle/backbone.baseview)
[![Test Coverage](https://codeclimate.com/github/thejameskyle/backbone.baseview/badges/coverage.svg)](https://codeclimate.com/github/thejameskyle/backbone.baseview)
[![Dependency Status](https://david-dm.org/thejameskyle/backbone.baseview.svg)](https://david-dm.org/thejameskyle/backbone.baseview)
[![devDependency Status](https://david-dm.org/thejameskyle/backbone.baseview/dev-status.svg)](https://david-dm.org/thejameskyle/backbone.baseview#info=devDependencies)

```js
import _ from 'underscore';
import Backbone from 'backbone';
import BaseView from 'backbone.baseview';

const MyView = BaseView.extend({
  tagName: 'ul',
  template: _.template(`
    <% _.each(collection, function(model) { %>
      <li><%- model.value %></li>
    <% }); %>
  `)
});

const collection = new Backbone.Collection([
  { value: 'One' },
  { value: 'Two' },
  { value: 'Three' }
]);

const myView = new MyView({
  collection: collection
});

layoutView.render();
layoutView.$el.appendTo(document.body);
```

```html
<body>
  <div id="layout">
    <aside>
      <nav id="sidebar">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </aside>
    <main>
      <div id="content">
        <h1>Hello World</h1>
        <p>Look at this nice content.</p>
      </div>
    </main>
  </div>
</body>
```
