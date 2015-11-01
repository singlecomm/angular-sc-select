import angular from 'angular';
import 'select2/select2.css';
import 'select2-bootstrap-css/select2-bootstrap.css';
import scSelectParser from './factories/scSelectParser';
import scSelect from './directives/scSelect';
import scOptions from './directives/scOptions';
import scSelectPaginator from './directives/scSelectPaginator';

export default angular
  .module('sc.select', ['ngSanitize', 'ui.select'])
  .factory('scSelectParser', scSelectParser)
  .directive('scSelect', scSelect)
  .directive('scOptions', scOptions)
  .directive('scSelectPaginator', scSelectPaginator)
  .run(($templateCache) => {

    'ngInject';

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

    'ngInject';

    const singleTemplateName = 'select2/select.tpl.html';
    const singleTemplate = angular.element(`<div>${$templateCache.get(singleTemplateName)}</div>`);
    singleTemplate
      .find('input')
      .parent()
      .append(angular.element('<sc-select-paginator></sc-select-paginator>'));
    $templateCache.put(singleTemplateName, singleTemplate.html());

  })
  .name;
