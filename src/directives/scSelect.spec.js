import angular from 'angular';
import $ from 'jquery';

describe('scSelect directive', () => {

  let $rootScope, $compile;

  beforeEach(inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  function createSelect(template) {
    const scope = $rootScope.$new();
    scope.vm = {
      items: []
    };
    const elm = angular.element(template);
    $compile(elm)(scope);
    scope.$apply();
    const selectCtrl = elm.isolateScope().vm;
    return {
      scope,
      elm: $(elm),
      selectCtrl
    };
  }

  describe('directive', () => {

    it('should create a single select by default', () => {
      const {elm} = createSelect('<sc-select ng-model="vm.value" sc-options="item for item in vm.items"></sc-select>');
      expect(elm.find('.ui-select-container').hasClass('ui-select-multiple')).to.be.false;
    });

    it('should allow multiple values to be selected', () => {
      const {elm} = createSelect('<sc-select ng-model="vm.value" sc-options="item for item in vm.items" multiple="true"></sc-select>');
      expect(elm.find('.ui-select-container').hasClass('ui-select-multiple')).to.be.true;
    });

    it('should show the toggle button', () => {

    });

    it('should call the toggle controller method', () => {

    });

    it('should disable the select', () => {

    });

    it('should group items', () => {

    });

    it('should set placeholder text on the select', () => {

    });

    it('should disable the search box', () => {

    });

    it('should set the refresh delay', () => {

    });

    it('should set the loading delay', () => {

    });

  });

  describe('controller', () => {

    describe('searchItems', () => {

    });

    describe('changePage', () => {

    });

    describe('setOptionScope', () => {

    });

    describe('setNgModelCtrl', () => {

    });

    describe('modelChanged', () => {

    });

    describe('getMappedItem', () => {

    });

    describe('toggleAll', () => {

    });

  });

});
