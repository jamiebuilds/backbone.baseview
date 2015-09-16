import Backbone.BaseView from '../../src/backbone.baseview';

describe('Backbone.BaseView', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(Backbone.BaseView, 'greet');
      Backbone.BaseView.greet();
    });

    it('should have been run once', () => {
      expect(Backbone.BaseView.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(Backbone.BaseView.greet).to.have.always.returned('hello');
    });
  });
});
