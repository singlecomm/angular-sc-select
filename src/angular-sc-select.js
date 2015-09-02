import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import uiSelect from 'exports?"ui.select"!ui-select';
import 'ui-select/dist/select.css';

export default angular
  .module('sc.select', [
    ngSanitize,
    uiSelect
  ])
  .factory('scSelectParser', ['$parse', function($parse) {

    const TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;

    return {
      parse: function(input) {
        var match = input.match(TYPEAHEAD_REGEXP);
        if (!match) {
          throw new Error(
            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
            ' but got "' + input + '".');
        }

        return {
          itemName: match[3],
          source: $parse(match[4]),
          viewMapper: $parse(match[2] || match[1]),
          modelMapper: $parse(match[1])
        };
      }
    };

  }])
  .directive('scSelect', () => {

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
          <ui-select-choices repeat="item in vm.items | filter: $select.search" refresh="vm.searchItems()">
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

    return {
      restrict: 'E',
      require: 'ngModel',
      template: '<div></div>',
      controller: function($attrs, $element, $compile, $scope, $q, scSelectParser) {

        var vm = this, optionScope;
        vm.currentPage = 1;
        vm.canToggleAll = vm.multiple && !vm.pageLimit;

        var selectElm = angular.element(template);
        if (vm.multiple) {
          selectElm.find('ui-select').attr('multiple', 'multiple');
        }
        $compile(selectElm)($scope);
        $element.append(selectElm);

        vm.searchItems = function() {
          return $q.when(vm.parsedOptions.source(optionScope, {page: vm.currentPage})).then(function(items) {
            vm.items = items;
          });
        };

        vm.changePage = function(newPage) {
          vm.currentPage = newPage;
          vm.searchItems();
        };

        vm.parsedOptions = scSelectParser.parse($attrs.scOptions);

        vm.setOptionScope = function(scope) {
          optionScope = scope;
          vm.changePage(vm.currentPage);
        };

        vm.setNgModelCtrl = function(ngModelCtrl) {
          vm.ngModelCtrl = ngModelCtrl;
          ngModelCtrl.$render = function() {
            if (!ngModelCtrl.$viewValue) {
              return;
            }
            var matchingItems = vm.items.filter(function(item) {
              var itemValue = vm.parsedOptions.modelMapper({
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
          var modelValue;
          if (vm.multiple) {
            modelValue = vm.selected.map(function(item) {
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
        searchEnabled: '='
      },
      link: function(scope, elm, attrs, ngModelCtrl) {
        scope.vm.setNgModelCtrl(ngModelCtrl);
      }
    };

  })
  .directive('scOptions', () => {

    return {
      restrict: 'A',
      require: 'scSelect',
      link: (scope, elm, attrs, scSelectCtrl) => {
        scSelectCtrl.setOptionScope(scope);
      }
    };

  })
  .directive('scSelectPaginator', () => {

    return {
      restrict: 'E',
      require: '?^scSelect',
      template: `
        <div
          ng-style="{padding: vm.scSelectCtrl.multiple ? '10px' : '10px 0'}"
          ng-if="vm.scSelectCtrl && vm.scSelectCtrl.pageLimit">
          <div class="btn-group">
            <button
             class="btn btn-default btn-xs"
             ng-click="vm.scSelectCtrl.changePage(vm.scSelectCtrl.currentPage - 1)"
             ng-disabled="vm.scSelectCtrl.currentPage <= 1">
              <i class="glyphicon glyphicon-arrow-left"></i> Prev
            </button>
            <button
            class="btn btn-default btn-xs"
            ng-click="vm.scSelectCtrl.changePage(vm.scSelectCtrl.currentPage + 1)"
            ng-disabled="vm.scSelectCtrl.currentPage >= (vm.scSelectCtrl.totalItems / vm.scSelectCtrl.pageLimit)">
              Next <i class="glyphicon glyphicon-arrow-right"></i>
            </button>
          </div>
          <small class="pull-right">
            {{ (vm.scSelectCtrl.currentPage - 1) * vm.scSelectCtrl.pageLimit + 1 }} -
            {{ vm.scSelectCtrl.currentPage * vm.scSelectCtrl.pageLimit > vm.scSelectCtrl.totalItems ? vm.scSelectCtrl.totalItems : vm.scSelectCtrl.currentPage * vm.scSelectCtrl.pageLimit }} of
            {{ vm.scSelectCtrl.totalItems }} results
           </small>
        </div>
      `,
      scope: {},
      bindToController: true,
      controller: angular.noop,
      controllerAs: 'vm',
      link: (scope, elm, attrs, scSelectCtrl) => {
        scope.vm.scSelectCtrl = scSelectCtrl;
      }
    };

  })
  .run(($templateCache) => {

    const multiTemplateName = 'select2/select-multiple.tpl.html';
    const multiTemplate = angular.element(`<div>${$templateCache.get(multiTemplateName)}</div>`);
    multiTemplate
      .find('ul')
      .next()
      .prepend(angular.element('<sc-select-paginator></sc-select-paginator>'));
    multiTemplate.find('input').attr('ng-disabled', '$select.disabled || ($select.searchEnabled === false && $select.open)');
    $templateCache.put(multiTemplateName, multiTemplate.html());

  })
  .run(($templateCache) => {

    const singleTemplateName = 'select2/select.tpl.html';
    const singleTemplate = angular.element(`<div>${$templateCache.get(singleTemplateName)}</div>`);
    singleTemplate
      .find('input')
      .parent()
      .append(angular.element('<sc-select-paginator></sc-select-paginator>'));
    $templateCache.put(singleTemplateName, singleTemplate.html());

  })
  .name;
