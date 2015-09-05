import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import uiSelect from 'exports?"ui.select"!ui-select';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'select2/select2.css';
import 'select2-bootstrap-css/select2-bootstrap.css';
import 'ui-select/dist/select.css';
import scSelectParser from './factories/scSelectParser';
import scSelect from './directives/scSelect';
import scOptions from './directives/scOptions';
import scSelectPaginator from './directives/scSelectPaginator';

export default angular
  .module('sc.select', [ngSanitize, uiSelect])
  .factory('scSelectParser', scSelectParser)
  .directive('scSelect', scSelect)
  .directive('scOptions', scOptions)
  .directive('scSelectPaginator', scSelectPaginator)
  .run(/*@ngInject*/ ($templateCache) => {

    const multiTemplateName = 'select2/select-multiple.tpl.html';
    const multiTemplate = angular.element(`<div>${$templateCache.get(multiTemplateName)}</div>`);
    multiTemplate
      .find('ul')
      .next()
      .prepend(angular.element('<sc-select-paginator></sc-select-paginator>'));
    multiTemplate.find('input').attr('ng-disabled', '$select.disabled || ($select.searchEnabled === false && $select.open)');
    $templateCache.put(multiTemplateName, multiTemplate.html());

  })
  .run(/*@ngInject*/ ($templateCache) => {

    const singleTemplateName = 'select2/select.tpl.html';
    const singleTemplate = angular.element(`<div>${$templateCache.get(singleTemplateName)}</div>`);
    singleTemplate
      .find('input')
      .parent()
      .append(angular.element('<sc-select-paginator></sc-select-paginator>'));
    $templateCache.put(singleTemplateName, singleTemplate.html());

  })
  .name;
