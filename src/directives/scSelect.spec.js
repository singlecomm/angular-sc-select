import angular from 'angular';
import $ from 'jquery';

describe('scSelect directive', () => {

  let $rootScope, $compile, $timeout;

  beforeEach(inject((_$rootScope_, _$compile_, _$timeout_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  function createSelect(template) {
    const scope = $rootScope.$new();
    scope.vm = {
      items: [{name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States'}],
      groupBy: (item) => {
        if (item.name[0] >= 'A' && item.name[0] <= 'M') {
          return 'From A - M';
        }
        if (item.name[0] >= 'N' && item.name[0] <= 'Z') {
          return 'From N - Z';
        }
      },
      searchItems: sinon.stub().returns([])
    };
    sinon.spy(scope.vm, 'groupBy');
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
      const {elm} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items">
        </sc-select>
      `);
      expect(elm.find('.ui-select-container').hasClass('ui-select-multiple')).to.be.false;
    });

    it('should allow multiple values to be selected', () => {
      const {elm} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          multiple="true">
        </sc-select>
      `);
      expect(elm.find('.ui-select-container').hasClass('ui-select-multiple')).to.be.true;
    });

    it('should show the toggle button', () => {
      const {elm} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          multiple="true">
        </sc-select>
      `);
      expect(elm.find('.input-group-btn button').size()).to.be.equal(1);
    });

    it('should call the toggle controller method', () => {
      const {elm, selectCtrl, scope} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          multiple="true">
        </sc-select>
      `);
      sinon.spy(selectCtrl, 'toggleAll');
      elm.find('.input-group-btn button').click();
      scope.$apply();
      expect(selectCtrl.toggleAll).to.have.been.called;
    });

    it('should disable the select', () => {
      const {elm} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          ng-disabled="true">
        </sc-select>
      `);
      expect(elm.find('.ui-select-container').hasClass('select2-container-disabled')).to.be.true;
    });

    it('should group items', () => {
      const {scope} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          group-by="vm.groupBy">
        </sc-select>
      `);
      $timeout.flush();
      expect(scope.vm.groupBy).to.have.been.calledWith(scope.vm.items[0]);
    });

    it('should set placeholder text on the select', () => {
      const {elm} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          placeholder="Test">
        </sc-select>
      `);
      expect(elm.find('.select2-chosen:first').html()).to.equal('Test');
    });

    it('should disable the search box', () => {
      const {elm} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.items"
          search-enabled="false">
        </sc-select>
      `);
      expect(elm.find('.select2-search').is(':visible')).to.be.false;
    });

    it('should set the refresh delay', () => {
      const {scope} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.searchItems()"
          refresh-delay="1000">
        </sc-select>
      `);
      $timeout.flush(500);
      expect(scope.vm.searchItems).not.to.have.been.called;
      $timeout.flush(1000);
      expect(scope.vm.searchItems).to.have.been.called;
    });

    it('should set the loading delay', () => {
      const {selectCtrl} = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.searchItems()"
          loading-delay="1000">
        </sc-select>
      `);
      expect(selectCtrl.loadingDelay).to.equal(1000);
    });

  });

  describe('controller', () => {

    let select;
    beforeEach(function() {
      select = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.searchItems()">
        </sc-select>
      `);
      $timeout.flush();
    });

    describe('searchItems', () => {

      it('should reset the page number if the search text changed', () => {
        select.selectCtrl.currentPage = 5;
        select.selectCtrl.uiSelectCtrl.search = 'changed';
        select.selectCtrl.searchItems();
        expect(select.selectCtrl.currentPage).to.equal(1);
      });

      it('should set loading to true and reset items after a timeout', () => {
        select.scope.vm.searchItems.returns($timeout(angular.noop, 1000));
        select.selectCtrl.loading = false;
        select.selectCtrl.items = [{id: 1}];
        select.selectCtrl.searchItems();
        $timeout.flush(0);
        expect(select.selectCtrl.loading).to.be.true;
        expect(select.selectCtrl.items).to.eql([]);
      });

      it('should update items from the expression', () => {
        const items = [{test: true}];
        select.selectCtrl.items = [];
        select.scope.vm.searchItems.returns(items);
        select.selectCtrl.searchItems();
        select.scope.$apply();
        expect(select.selectCtrl.items).to.equal(items);
      });

      it('should set loading to false when the items array has been fetched', () => {
        select.selectCtrl.loading = true;
        select.selectCtrl.searchItems();
        select.scope.$apply();
        expect(select.selectCtrl.loading).to.be.false;
      });

    });

    describe('changePage', () => {

      it('should change the current page', () => {
        sinon.spy(select.selectCtrl, 'searchItems');
        select.selectCtrl.currentPage = 1;
        select.selectCtrl.changePage(10);
        expect(select.selectCtrl.currentPage).to.equal(10);
        expect(select.selectCtrl.searchItems).to.have.been.called;
      });

    });

    describe('setOptionScope', () => {

      it('should set the sc-options scope', () => {
        sinon.spy(select.selectCtrl, 'changePage');
        select.selectCtrl.setOptionScope(select.scope);
        expect(select.selectCtrl.optionScope).to.equal(select.scope);
        expect(select.selectCtrl.changePage).to.have.been.called;
      });

    });

    describe('setNgModelCtrl', () => {

      let ngModelCtrl;
      beforeEach(() => {
        ngModelCtrl = {};
        select.selectCtrl.setNgModelCtrl(ngModelCtrl);
      });

      it('should set the ngModelCtrl', () => {
        expect(select.selectCtrl.ngModelCtrl).to.equal(ngModelCtrl);
      });

      describe('ngModelCtrl.$render', () => {

        it('should do nothing if there is no model value', () => {
          ngModelCtrl.$viewValue = null;
          select.selectCtrl.selected = 'unchanged';
          ngModelCtrl.$render();
          expect(select.selectCtrl.selected).to.equal('unchanged');
        });

        it('should update the controllers selected value to the model value', () => {
          select.selectCtrl.multiple = false;
          select.selectCtrl.selected = [];
          const items = [{id: 1}, {id: 2}];
          select.selectCtrl.items = items;
          ngModelCtrl.$viewValue = items[0];
          ngModelCtrl.$render();
          expect(select.selectCtrl.selected).to.equal(items[0]);
        });

        it('should update the controllers selected value to an array of items when multiple items can be selected', () => {
          select.selectCtrl.multiple = true;
          select.selectCtrl.selected = [];
          const items = [{id: 1}, {id: 2}];
          select.selectCtrl.items = items;
          ngModelCtrl.$viewValue = [items[0]];
          ngModelCtrl.$render();
          expect(select.selectCtrl.selected).to.eql([items[0]]);
        });

      });

    });

    describe('modelChanged', () => {

      it('should update the model value to a single item when a single select', () => {
        sinon.spy(select.selectCtrl.ngModelCtrl, '$setViewValue');
        select.selectCtrl.multiple = false;
        select.selectCtrl.selected = 1;
        select.selectCtrl.modelChanged();
        expect(select.selectCtrl.ngModelCtrl.$setViewValue).to.have.been.calledWith(1);
      });

      it('should update the model value to an array of selected items when a multi select', () => {
        sinon.spy(select.selectCtrl.ngModelCtrl, '$setViewValue');
        select.selectCtrl.multiple = true;
        select.selectCtrl.selected = [1, 2, 3];
        select.selectCtrl.modelChanged();
        expect(select.selectCtrl.ngModelCtrl.$setViewValue).to.have.been.calledWith([1, 2, 3]);
      });

    });

    describe('toggleAll', () => {

      it('should select all items', () => {
        sinon.spy(select.selectCtrl, 'modelChanged');
        select.selectCtrl.items = [{id: 1}];
        select.selectCtrl.selected = [];
        select.selectCtrl.toggleAll();
        expect(select.selectCtrl.selected).to.eql(select.selectCtrl.items);
        expect(select.selectCtrl.modelChanged).to.have.been.called;
      });

      it('should deselect all items', () => {
        sinon.spy(select.selectCtrl, 'modelChanged');
        select.selectCtrl.items = [{id: 1}];
        select.selectCtrl.selected = [{id: 1}];
        select.selectCtrl.toggleAll();
        expect(select.selectCtrl.selected).to.eql([]);
        expect(select.selectCtrl.modelChanged).to.have.been.called;
      });

    });

  });

});
