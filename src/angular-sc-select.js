import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import uiSelect from 'exports?"ui.select"!ui-select';
import 'ui-select/dist/select.css';

export default angular
  .module('sc.select', [
    ngSanitize,
    uiSelect
  ])
  .name;
