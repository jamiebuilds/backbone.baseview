import BaseView from '../../src/backbone.baseview';
import Backbone from 'backbone';
import _ from 'underscore';

describe('View', function() {
  it('should be subclassed properly', function() {
    expect(new BaseView())
      .to.be.instanceOf(Backbone.View);
  });

  describe('#compile', function() {
    it('should return undefined when no template is defined', function() {
      var view = new BaseView();
      expect(view.compile())
        .to.be.undefined;
    });

    it('should compile a template with data if defined', function() {
      var view = new BaseView();
      view.template = stub().returns('foo');
      view.serializeData = stub().returns({
        bar: 'baz'
      });

      expect(view.compile())
        .to.equal('foo');
      expect(view.serializeData)
        .to.have.been.calledOnce
        .and.calledOn(view);
      expect(view.template)
        .to.have.been.calledOnce
        .and.calledOn(view)
        .and.calledWith({
          bar: 'baz'
        });
    });
  });

  describe('#render', function() {
    beforeEach(function() {
      this.parentNode = document.createElement('div');
      this.nextSibling = document.createElement('div');
      this.parentNode.appendChild(this.nextSibling);
      this.template = stub().returns('foo');
      this.view = new BaseView({
        template: this.template
      });
      spy(this.view, 'compile');
      spy(this.view, 'detach');
      spy(this.view, 'attach');
      spy(this.view, 'trigger');
    });

    it('should render the view', function() {
      expect(this.view.render().el.innerHTML)
        .to.equal('foo');
    });

    it('should detach and reattach the view', function() {
      this.view.attach(this.parentNode);
      this.view.render();
      expect(this.view.detach)
        .to.have.been.calledOn(this.view);
      expect(this.view.attach)
        .to.have.been.calledOn(this.view);
      expect(this.view.detach)
        .to.have.been.calledBefore(this.view.attach);
    });

    it('should attach the view to the same place it was detached', function() {
      this.view.attach(this.parentNode, this.nextSibling);
      this.view.render();
      expect(this.view.attach)
        .to.have.been.calledWith(this.parentNode, this.nextSibling);
    });

    it('should not render the view twice if it doesnt change', function() {
      this.view.attach(this.parentNode);
      this.view.attach.reset();
      this.view.render();
      this.view.render();
      expect(this.view.compile)
        .to.have.been.calledTwice;
      expect(this.view.detach)
        .to.have.been.calledOnce;
      expect(this.view.attach)
        .to.have.been.calledOnce;
    });

    it('should fire "render" after rendering', function() {
      this.view.on('render', function() {
        expect(this.view.el.innerHTML)
          .to.equal('foo');
      }, this);
      this.view.render();
      expect(this.view.trigger)
        .to.have.been.calledWith('render');
    });

    it('should throw an error when trying to render a removed view', function() {
      var self = this;
      this.view.remove();
      expect(function() {
        self.view.render();
      }).to.throw(Error, 'Views cannot be rendered after they have been removed.');
    });

    it('should return this', function() {
      expect(this.view.render()).to.equal(this.view);
    });
  });

  describe('#attach', function() {
    beforeEach(function() {
      this.parentNode = document.createElement('div');
      this.nextSibling = document.createElement('div');
      this.view = new BaseView();
      spy(this.view, 'trigger');
    });

    it('should attach a view to a parent node', function() {
      this.view.attach(this.parentNode);
      expect(this.parentNode.firstChild)
        .to.equal(this.view.el);
    });

    it('should attach a view to a parent node before a sibling', function() {
      this.parentNode.appendChild(this.nextSibling);
      this.view.attach(this.parentNode, this.nextSibling);
      expect(this.parentNode.firstChild)
        .to.equal(this.view.el);
      expect(this.nextSibling.previousSibling)
        .to.equal(this.view.el);
    });

    it('should not attempt to attach a view twice', function() {
      this.view.attach(this.parentNode);
      this.view.trigger.reset();
      this.view.attach(this.parentNode);
      expect(this.view.trigger)
        .not.to.have.calledWith('attach');
    });

    it('should fire "attach" after attaching', function() {
      this.view.on('attach', function() {
        expect(this.parentNode.firstChild)
          .to.equal(this.view.el);
        expect(this.view.isAttached())
          .to.be.true;
      }, this);
      this.view.attach(this.parentNode);
      expect(this.view.trigger)
        .to.have.been.calledWith('attach');
    });

    it('should throw an error when trying to attach a removed view', function() {
      var self = this;
      this.view.remove();
      expect(function() {
        self.view.attach(self.parentNode);
      }).to.throw(Error, 'Views cannot be attached after they have been removed.');
    });

    it('should return this', function() {
      expect(this.view.attach(this.parentNode)).to.equal(this.view);
    });
  });

  describe('#detach', function() {
    beforeEach(function() {
      this.parentNode = document.createElement('div');
      this.view = new BaseView();
      this.view.attach(this.parentNode);
      spy(this.view, 'trigger');
    });

    it('should detach a view', function() {
      this.view.detach();
      expect(this.parentNode.firstChild)
        .not.to.equal(this.view.el);
    });

    it('should not attempt to detach a view twice', function() {
      this.view.detach();
      this.view.trigger.reset();
      this.view.detach();
      expect(this.view.trigger)
        .not.to.have.calledWith('detach');
    });

    it('should fire "detach" after detaching', function() {
      this.view.on('detach', function() {
        expect(this.parentNode.firstChild)
          .not.to.equal(this.view.el);
        expect(this.view.isAttached())
          .to.be.false;
      }, this);
      this.view.detach();
      expect(this.view.trigger)
        .to.have.been.calledWith('detach');
    });

    it('should throw an error when trying to detach a removed view', function() {
      var self = this;
      this.view.remove();
      expect(function() {
        self.view.detach();
      }).to.throw(Error, 'Views cannot be detached after they have been removed.');
    });

    it('should return this', function() {
      expect(this.view.detach()).to.equal(this.view);
    });
  });

  describe('#remove', function() {
    beforeEach(function() {
      this.parentNode = document.createElement('div');
      this.template = stub().returns('foo');
      this.view = new BaseView({
        template: this.template
      });
      spy(this.view, 'detach');
      spy(this.view, 'trigger');
      this.view.attach(this.parentNode);
      this.view.render();
    });

    it('should detach the view', function() {
      this.view.remove();
      expect(this.view.detach)
        .to.have.been.called;
    });

    it('should empty the views html', function() {
      // This can only be tested by spying on utils.innerHTML because view.el
      // is deleted as part of remove.
      spy(this.view, '_setInnerHTML');
      var el = this.view.el;
      this.view.remove();
      expect(this.view._setInnerHTML)
        .to.have.been.calledWith('');
    });

    it('should fire "remove" after detaching', function() {
      var el = this.view.el;
      this.view.on('remove', function() {
        expect(this.parentNode.firstChild)
          .not.to.equal(el);
        expect(this.view.isRemoved())
          .to.be.true;
        expect(this.view.isRendered())
          .to.be.false;
        expect(this.view.isAttached())
          .to.be.false;
      }, this);
      this.view.remove();
      expect(this.view.trigger)
        .to.have.been.calledWith('remove');
    });

    it('should throw an error when trying to remove an already removed view', function() {
      var self = this;
      this.view.remove();
      expect(function() {
        self.view.remove();
      }).to.throw(Error, 'Views cannot be removed more than once.');
    });

    it('should return this', function() {
      expect(this.view.remove()).to.equal(this.view);
    });
  });

  describe('#serializeData', function() {
    beforeEach(function() {
      this.data = [{
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      }];
      this.collection = new Backbone.Collection(this.data);
      this.model = new Backbone.Model(this.data[0]);
      this.view = new BaseView();
      spy(this.view, 'serializeModel');
      spy(this.view, 'serializeCollection');
    });

    it('should call serializeModel for views with a model', function() {
      this.view.model = this.model;
      this.view.serializeData();
      expect(this.view.serializeModel)
        .to.have.been.calledOn(this.view)
        .and.calledWith(this.model);
    });

    it('should call serializeCollection for views with a collection', function() {
      this.view.collection = this.collection;
      this.view.serializeData();
      expect(this.view.serializeCollection)
        .to.have.been.calledOn(this.view)
        .and.calledWith(this.collection);
    });
  });

  describe('#serializeModel', function() {
    beforeEach(function() {
      this.data = {
        id: 1
      };
      this.model = new Backbone.Model(this.data);
      this.view = new BaseView();
    });

    it('should serialize the collection', function() {
      expect(this.view.serializeModel(this.model))
        .to.deep.equal(this.data);
    });

    it('should be returning a clone of the data', function() {
      expect(this.view.serializeModel(this.model))
        .not.to.equal(this.data);
    });
  });

  describe('#serializeCollection', function() {
    beforeEach(function() {
      this.data = [{
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      }];
      this.collection = new Backbone.Collection(this.data);
      this.view = new BaseView();
      spy(this.view, 'serializeModel');
    });

    it('should serialize the collection', function() {
      expect(this.view.serializeCollection(this.collection))
        .to.deep.equal({
          collection: this.data
        });
    });

    it('should be returning a clone of the data', function() {
      expect(this.view.serializeCollection(this.collection).collection)
        .not.to.equal(this.data);
    });

    it('should be calling serializeModel for each model', function() {
      this.view.serializeCollection(this.collection);
      expect(this.view.serializeModel)
        .to.have.been.calledOn(this.view)
        .and.calledWith(this.collection.models[0])
        .and.calledWith(this.collection.models[1])
        .and.calledWith(this.collection.models[2]);
    });
  });

  describe('#isRendered', function() {
    beforeEach(function() {
      this.dom = document.createElement('div');
      this.view = new BaseView();
    });

    it('should return false before view is rendered', function() {
      expect(this.view.isRendered())
        .to.be.false;
    });

    it('should return true after the view is rendered', function() {
      expect(this.view.render().isRendered())
        .to.be.true;
    });

    it('should return false after the view is removed', function() {
      expect(this.view.render().remove().isRendered())
        .to.be.false;
    });
  });

  describe('#isRemoved', function() {
    beforeEach(function() {
      this.dom = document.createElement('div');
      this.view = new BaseView();
    });

    it('should return false before view is removed', function() {
      expect(this.view.isRemoved())
        .to.be.false;
    });

    it('should return true after the view is removed', function() {
      expect(this.view.remove().isRemoved())
        .to.be.true;
    });
  });

  describe('#isAttached', function() {
    beforeEach(function() {
      this.dom = document.createElement('div');
      this.view = new BaseView();
    });

    it('should return false before view is attached', function() {
      expect(this.view.isAttached())
        .to.be.false;
    });

    it('should return true after the view is attached', function() {
      expect(this.view.attach(this.dom).isAttached())
        .to.be.true;
    });

    it('should return false after the view is detached', function() {
      expect(this.view.attach(this.dom).detach().isAttached())
        .to.be.false;
    });
  });

  describe('#isView', function() {
    beforeEach(function() {
      this.MyView = BaseView.extend().extend();
      this.MyCtor = function() {};
    });

    it('should return true for views', function() {
      expect(BaseView.isView(this.MyView))
        .to.be.true;
    });

    it('should return true for instances of View', function() {
      expect(BaseView.isView(new this.MyView()))
        .to.be.true;
    });

    it('should return false for normal constructors', function() {
      expect(BaseView.isView(this.MyCtor))
        .to.be.false;
    });

    it('should return false for other values', function() {
      _.each([true, false, undefined, null, 0, 'hi'], function(val) {
        expect(BaseView.isView(val))
          .to.be.false;
      });
    });
  });

  describe('utils', function() {
    describe('#_getParentNode', function() {
      beforeEach(function() {
        this.view = new BaseView();
        this.parent = document.createElement('div');
      });

      it('should return a the parent node', function() {
        this.parent.appendChild(this.view.el);
        expect(this.view._getParentNode())
          .to.equal(this.parent);
      });

      it('should return null when there is no parent node', function() {
        expect(this.view._getParentNode())
          .to.be.null;
      });
    });

    describe('#_getNextSibling', function() {
      beforeEach(function() {
        this.view1 = new BaseView();
        this.view2 = new BaseView();
        this.parent = document.createElement('div');
        this.parent.appendChild(this.view1.el);
        this.parent.appendChild(this.view2.el);
      });

      it('should return the next sibling', function() {
        expect(this.view1._getNextSibling())
          .to.equal(this.view2.el);
      });

      it('should return null when there is no next sibling', function() {
        expect(this.view2._getNextSibling())
          .to.be.null;
      });
    });

    describe('#_insertBefore', function() {
      beforeEach(function() {
        this.view = new BaseView();
        this.parent = document.createElement('div');
        this.child2 = document.createElement('div');
        this.parent.appendChild(this.child2);
      });

      it('should insert the node into the parent node before the next sibling', function() {
        this.view._insertBefore(this.parent, this.child2);
        expect(this.parent.firstChild)
          .to.equal(this.view.el);
      });
    });

    describe('#_appendChild', function() {
      beforeEach(function() {
        this.view = new BaseView();
        this.parent = document.createElement('div');
      });

      it('should append the node into the parent node', function() {
        this.view._appendChild(this.parent);
        expect(this.parent.lastChild)
          .to.equal(this.view.el);
      });
    });

    describe('#_getInnerHTML', function() {
      beforeEach(function() {
        this.view = new BaseView();
        this.view.el.innerHTML = 'foo';
      });

      it('should get the innerHTML when no html is passed', function() {
        expect(this.view._getInnerHTML())
          .to.equal('foo');
      });
    });

    describe('#_setInnerHTML', function() {
      beforeEach(function() {
        this.view = new BaseView();
      });

      it('should set the innerHTML when html is passed', function() {
        this.view._setInnerHTML('bar');
        expect(this.view.el.innerHTML)
          .to.equal('bar');
      });
    });

    describe('#_remove', function() {
      beforeEach(function() {
        this.view = new BaseView();
        this.parent = document.createElement('div');
        this.parent.appendChild(this.view.el);
      });

      it('should remove the node from the dom', function() {
        this.view._remove();
        expect(this.view.el.parentNode).to.be.null;
      });
    });
  });
});
