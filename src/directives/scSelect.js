import angular from 'angular';

const template = `
  <div ng-class="{'input-group select2-bootstrap-append': vm.canToggleAll}">
    <ui-select
      ng-model="vm.selected"
      ng-change="vm.modelChanged()"
      ng-disabled="vm.ngDisabled"
      theme="select2"
      class="form-control"
      search-enabled="vm.searchEnabled">
      <ui-select-match placeholder="{{ vm.placeholder }}">
        {{ vm.getMappedItem($item || $select.selected) }}
      </ui-select-match>
      <ui-select-choices
        repeat="item in vm.items | filter: $select.search"
        refresh="vm.searchItems()"
        refresh-delay="vm.refreshDelay || 200"
        group-by="vm.groupBy">
        <div ng-bind-html="vm.getMappedItem(item) | highlight: $select.search"></div>
      </ui-select-choices>
    </ui-select>
    <span class="input-group-btn" ng-if="vm.canToggleAll">
      <button
        ng-click="vm.toggleAll()"
        class="btn btn-default"
        style="height: calc(100% + 14px)">
        <span class="fa fa-check-square-o" ng-show="vm.items.length !== vm.selected.length"></span>
        <span class="fa fa-square-o" ng-show="vm.items.length === vm.selected.length"></span>
      </button>
    </span>
  </div>
`;

export default function /*@ngInject*/ scSelect() {

  return {
    restrict: 'E',
    require: 'ngModel',
    template: '<div></div>',
    controller: /*@ngInject*/ function($attrs, $element, $compile, $scope, $q, $timeout, scSelectParser) {

      const vm = this;
      const loadingDelay = angular.isDefined(vm.loadingDelay) ? vm.loadingDelay : 0;
      vm.currentPage = 1;
      vm.canToggleAll = vm.multiple && !vm.pageLimit;

      const selectElm = angular.element(template);
      if (vm.multiple) {
        selectElm.find('ui-select').attr('multiple', 'multiple');
      }
      $compile(selectElm)($scope);
      $element.append(selectElm);

      vm.items = [];

      let oldSearchText;

      vm.searchItems = function() {
        if (vm.uiSelectCtrl) {
          //reset page if the search text has changed
          if (oldSearchText !== vm.uiSelectCtrl.search) {
            vm.currentPage = 1;
          }

          oldSearchText = vm.uiSelectCtrl.search;
          const setLoadingTimeout = $timeout(() => {
            vm.loading = true;
            vm.items = [];
          }, loadingDelay);

          return $q.when(vm.parsedOptions.source(vm.optionScope, {
            page: vm.currentPage,
            searchText: vm.uiSelectCtrl.search
          })).then((items) => {
            vm.items = items;
          }).finally(() => {
            vm.loading = false;
            $timeout.cancel(setLoadingTimeout);
          });

        }
      };

      vm.changePage = function(newPage) {
        vm.currentPage = newPage;
        vm.searchItems();
      };

      vm.parsedOptions = scSelectParser.parse($attrs.scOptions);

      vm.setOptionScope = function(scope) {
        vm.optionScope = scope; //expose for testing
        vm.changePage(vm.currentPage);
      };

      vm.setNgModelCtrl = function(ngModelCtrl) {
        vm.ngModelCtrl = ngModelCtrl;

        ngModelCtrl.$render = function() {
          if (!ngModelCtrl.$viewValue) {
            return;
          }
          const matchingItems = vm.items.filter((item) => {
            const itemValue = vm.parsedOptions.modelMapper({
              [vm.parsedOptions.itemName]: item
            });
            if (vm.multiple) {
              return ngModelCtrl.$viewValue.indexOf(itemValue) > -1;
            } else {
              return ngModelCtrl.$viewValue === itemValue;
            }
          });
          if (vm.multiple) {
            vm.selected = matchingItems;
          } else {
            vm.selected = matchingItems[0];
          }
        };

      };

      vm.modelChanged = function() {
        let modelValue;
        if (vm.multiple) {
          modelValue = vm.selected.map((item) => {
            return vm.parsedOptions.modelMapper({
              [vm.parsedOptions.itemName]: item
            });
          });
        } else {
          modelValue = vm.parsedOptions.modelMapper({
            [vm.parsedOptions.itemName]: vm.selected
          });
        }
        vm.ngModelCtrl.$setViewValue(modelValue);
      };

      vm.getMappedItem = function(localItem) {
        return vm.parsedOptions.viewMapper({
          [vm.parsedOptions.itemName]: localItem
        });
      };

      vm.toggleAll = function() {
        if (!vm.selected || vm.selected.length < vm.items.length) {
          vm.selected = vm.items;
        } else {
          vm.selected = [];
        }
        vm.modelChanged();
      };

    },
    controllerAs: 'vm',
    bindToController: true,
    scope: {
      pageLimit: '=',
      totalItems: '=',
      placeholder: '@',
      multiple: '=',
      ngDisabled: '=',
      searchEnabled: '=',
      refreshDelay: '=',
      loadingDelay: '=',
      groupBy: '='
    },
    link: (scope, elm, attrs, ngModelCtrl) => {
      scope.vm.setNgModelCtrl(ngModelCtrl);
    }
  };

}
