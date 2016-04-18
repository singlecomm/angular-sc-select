import angular from 'angular';

const template = `
  <div ng-class="{ 'input-group select2-bootstrap-append': vm.canToggleAll && vm.toggleAllEnabled !== false }">
    <ui-select
      class="form-control"
      limit="{{ ::vm.multipleLimit }}"
      ng-model="vm.selected"
      ng-change="vm.modelChanged()"
      ng-disabled="vm.ngDisabled"
      search-enabled="vm.searchEnabled"
      theme="select2">
      <ui-select-match placeholder="{{ ::vm.placeholder }}">
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
    <span
      class="input-group-btn"
      ng-if="vm.canToggleAll && vm.toggleAllEnabled !== false">
      <button
        class="btn btn-default"
        title="Adds all available options"
        ng-click="vm.selectAll()"
        type="button"
        style="height: calc(100% + 14px)">
        <i class="fa fa-check-square-o"></i>
      </button>
      <button
        class="btn btn-default"
        title="Removes all options"
        ng-click="vm.deselectAll()"
        type="button"
        style="height: calc(100% + 14px)">
        <i class="fa fa-square-o"></i>
      </button>
    </span>
  </div>
`;

export default function scSelect() {

  'ngInject';

  return {
    restrict: 'E',
    require: 'ngModel',
    template: '<div></div>',
    controller: controller,
    controllerAs: 'vm',
    bindToController: true,
    scope: {
      groupBy: '=',
      loadingDelay: '=',
      multiple: '=?',
      multipleLimit: '@',
      ngDisabled: '=',
      pageLimit: '=',
      placeholder: '@',
      refreshDelay: '=',
      searchEnabled: '=',
      toggleAllEnabled: '=',
      totalItems: '='
    },
    link: (scope, elm, attrs, ngModelCtrl) => {
      scope.vm.setNgModelCtrl(ngModelCtrl);
    }
  };

  function controller($attrs, $element, $compile, $parse, $scope, $q, $timeout, scSelectParser) {

    'ngInject';

    const vm = this;
    const loadingDelay = angular.isDefined(vm.loadingDelay) ? vm.loadingDelay : 0;
    vm.currentPage = 1;
    vm.canToggleAll = vm.multiple && !vm.multipleLimit && !vm.pageLimit;

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
        //var cc = vm.multiple ? ngModelCtrl.$viewValue : vm.items;
        var items;
        if (vm.multiple) {
          items = ngModelCtrl.$viewValue;
        } else {
          items = vm.items;
        }
        var matchingItems = [];
        if (angular.isArray(items)) {
          matchingItems = items.filter((item) => {
            var itemValue;
            if (!angular.isArray(item)) {
              itemValue = item;
            } else {
              itemValue = vm.parsedOptions.modelMapper({
                [vm.parsedOptions.itemName]: item
              });
            }
            if (vm.multiple) {
              var found = false;
              if (typeof ngModelCtrl.$viewValue === 'object') {

                angular.forEach(ngModelCtrl.$viewValue, function(val) {
                  if (typeof val === 'string') {
                    if (val.indexOf(itemValue) > -1) {
                      found = true;
                    }
                  }
                  if (val && itemValue && val.id === itemValue.id) {
                    found = true;
                  }
                });
              } else if (ngModelCtrl.$viewValue.indexOf(itemValue) > -1) {
                found = true;
              }
              return found;
            } else {
              if (typeof itemValue === 'object') {
                return ngModelCtrl.$viewValue === itemValue.id || ngModelCtrl.$viewValue === itemValue.label || ngModelCtrl.$viewValue.id === itemValue.id;
              }
              return ngModelCtrl.$viewValue === itemValue;
            }
          });
        }

        if (matchingItems.length === 0 && typeof ngModelCtrl.$viewValue === 'object') {
          matchingItems = [ngModelCtrl.$viewValue];
        }

        if (vm.multiple) {
          vm.selected = matchingItems;
        } else {
          vm.selected = matchingItems[0];
        }
      };

      //Ensure items array has been populated first - as it uses $q.when it will be after the first digest
      $timeout(function() {
        vm.ngModelCtrl.$render();
      });

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

    vm.selectAll = function() {
      vm.selected = vm.items;
      vm.modelChanged();
    };

    vm.deselectAll = function() {
      vm.selected = [];
      vm.modelChanged();
    };

    $scope.$watch(function() {
      return vm.ngModelCtrl.$modelValue;
    }, function(selected) {
      if (!selected) {
        vm.selected = vm.multiple ? [] : '';
      }
    }, true);

    if (!angular.isDefined(vm.pageLimit)) {
      $scope.$watch(function() {
        return vm.parsedOptions.source(vm.optionScope);
      }, function(items) {
        if (items) {
          vm.items = items;
        }
      });
    }

    if (angular.isUndefined(vm.groupBy) && angular.isDefined($attrs.groupBy)) {
      const getGroupBy = $parse($attrs.groupBy);
      vm.groupBy = function(item) {
        return getGroupBy(item);
      };
    }

  }

}
