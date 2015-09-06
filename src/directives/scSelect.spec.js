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

  });

  describe('controller', () => {

    let selectCtrl;
    beforeEach(function() {
      const select = createSelect(`
        <sc-select
          ng-model="vm.value"
          sc-options="item for item in vm.searchItems()">
        </sc-select>
      `);
      selectCtrl = select.selectCtrl;
    });

    describe('searchItems', () => {

      it('should reset the page number if the search text changed', () => {

      });

      it('should set loading to true and reset items after a timeout', () => {

      });

      it('should update items from the expression', () => {

      });

      it('should set loading to false when the items array has been fetched', () => {

      });

    });

    describe('changePage', () => {

      it('should change the current page', () => {

      });

      it('should call search items', () => {

      });

    });

    describe('setOptionScope', () => {

      it('should set the sc-options scope', () => {

      });

      it('should call changed page', () => {

      });

    });

    describe('setNgModelCtrl', () => {

      it('should set the ngModelCtrl', () => {

      });

      describe('ngModelCtrl.$render', () => {

        it('should do nothing if there is no model value', () => {

        });

        it('should update the controllers selected value to the model value', () => {

        });

        it('should update the controllers selected value to an array of items when multiple items can be selected', () => {

        });

      });

    });

    describe('modelChanged', () => {

      it('should update the model value to an array of selected items when a multi select', () => {

      });

      it('should update the model value to a single item when a single select', () => {

      });

    });

    describe('getMappedItem', () => {

      it('should get the item in the context of the sc-options expression', () => {

      });

    });

    describe('toggleAll', () => {

      it('should select all items', () => {

      });

      it('should deselect all items', () => {

      });

    });

  });

});
