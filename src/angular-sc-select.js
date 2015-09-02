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

    return {
      restrict: 'E',
      controller: function() {

        var vm = this;
        vm.currentPage = 1;
        vm.changePage = function(newPage) {
          vm.currentPage = newPage;
        };

      },
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        pageLimit: '=',
        totalItems: '='
      }
    };

  })
  .directive('scOptions', () => {

    return {
      restrict: 'A',
      require: 'scSelect',
      link: (scope, elm, attrs, scSelectCtrl) => {
        scSelectCtrl.optionScope = scope; //this is the parent scope
      }
    };

  })
  .directive('scSelectPaginator', () => {

    return {
      restrict: 'E',
      require: '?^scSelect',
      template: `
        <div style="padding: 10px 0;" ng-if="vm.scSelectCtrl">
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
