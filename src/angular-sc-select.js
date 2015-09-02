import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import uiSelect from 'exports?"ui.select"!ui-select';
import 'ui-select/dist/select.css';
import selectPaginatorTemplate from './templates/select-paginator.html';

export default angular
  .module('sc.select', [
    ngSanitize,
    uiSelect
  ])
  .directive('scSelectPaginator', () => {

    return {
      restrict: 'E',
      template: selectPaginatorTemplate,
      scope: {},
      bindToController: true,
      controller: () => {

      },
      controllerAs: 'vm'
    };

  })
  .run(($templateCache) => {

    const multiTemplateName = 'select2/select-multiple.tpl.html';
    const multiTemplate = angular.element(`<div>${$templateCache.get(multiTemplateName)}</div>`);
    multiTemplate
      .find('ul')
      .next()
      .prepend(angular.element('<sc-select-paginator></sc-select-paginator>'));
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
