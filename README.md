# backbone.baseview

A simple BaseView for Backbone.

[![Travis build status](http://img.shields.io/travis/thejameskyle/backbone.baseview.svg?style=flat)](https://travis-ci.org/thejameskyle/backbone.baseview)
[![Code Climate](https://codeclimate.com/github/thejameskyle/backbone.baseview/badges/gpa.svg)](https://codeclimate.com/github/thejameskyle/backbone.baseview)
[![Test Coverage](https://codeclimate.com/github/thejameskyle/backbone.baseview/badges/coverage.svg)](https://codeclimate.com/github/thejameskyle/backbone.baseview)
[![Dependency Status](https://david-dm.org/thejameskyle/backbone.baseview.svg)](https://david-dm.org/thejameskyle/backbone.baseview)
[![devDependency Status](https://david-dm.org/thejameskyle/backbone.baseview/dev-status.svg)](https://david-dm.org/thejameskyle/backbone.baseview#info=devDependencies)

```js
import BaseView from 'backbone.baseview';

const LayoutView = BaseView.extend({
  id: 'layout',

  template() {
    return `
      <aside></aside>
      <main></main>
    `;
  },

  regions: {
    sidebar: 'aside',
    content: 'main'
  }
});

const SidebarView = BaseView.extend({
  id: 'sidebar',
  tagName: 'nav',

  template() {
    return `
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    `;
  }
});

const ContentView = BaseView.extend({
  id: 'content',

  template() {
    return `
      <h1>Hello World</h1>
      <p>Look at this nice content.</p>
    `;
  }
});

const layoutView = new LayoutView();
const sidebarView = new SidebarView();
const contentView = new ContentView();

layoutView.insertChild('sidebar', sidebarView);
layoutView.insertChild('content', contentView);

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
