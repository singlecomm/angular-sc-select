(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("angular")) : factory(root["angular"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	__webpack_require__(2);

	__webpack_require__(9);

	var _factoriesScSelectParser = __webpack_require__(11);

	var _factoriesScSelectParser2 = _interopRequireDefault(_factoriesScSelectParser);

	var _directivesScSelect = __webpack_require__(12);

	var _directivesScSelect2 = _interopRequireDefault(_directivesScSelect);

	var _directivesScOptions = __webpack_require__(13);

	var _directivesScOptions2 = _interopRequireDefault(_directivesScOptions);

	var _directivesScSelectPaginator = __webpack_require__(14);

	var _directivesScSelectPaginator2 = _interopRequireDefault(_directivesScSelectPaginator);

	exports['default'] = _angular2['default'].module('sc.select', ['ngSanitize', 'ui.select']).factory('scSelectParser', _factoriesScSelectParser2['default']).directive('scSelect', _directivesScSelect2['default']).directive('scOptions', _directivesScOptions2['default']).directive('scSelectPaginator', _directivesScSelectPaginator2['default']).run(["$templateCache", function ($templateCache) {

	  'ngInject';

	  var multiTemplateName = 'select2/select-multiple.tpl.html';
	  var multiTemplate = _angular2['default'].element('<div>' + $templateCache.get(multiTemplateName) + '</div>');
	  multiTemplate.find('ul').next().prepend(_angular2['default'].element('<sc-select-paginator></sc-select-paginator>'));
	  multiTemplate.find('input').attr('ng-disabled', '$select.disabled || ($select.searchEnabled === false && $select.open)');
	  $templateCache.put(multiTemplateName, multiTemplate.html());
	}]).run(["$templateCache", function ($templateCache) {

	  'ngInject';

	  var singleTemplateName = 'select2/select.tpl.html';
	  var singleTemplate = _angular2['default'].element('<div>' + $templateCache.get(singleTemplateName) + '</div>');
	  singleTemplate.find('input').parent().append(_angular2['default'].element('<sc-select-paginator></sc-select-paginator>'));
	  $templateCache.put(singleTemplateName, singleTemplate.html());
	}]).name;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = scSelectParser;

	function scSelectParser($parse) {

	  'ngInject';

	  var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;

	  return {
	    parse: function parse(input) {
	      var match = input.match(TYPEAHEAD_REGEXP);
	      if (!match) {
	        throw new Error('Expected options specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' + ' but got "' + input + '".');
	      }

	      return {
	        itemName: match[3],
	        source: $parse(match[4]),
	        viewMapper: $parse(match[2] || match[1]),
	        modelMapper: $parse(match[1])
	      };
	    }
	  };
	}
	scSelectParser.$inject = ["$parse"];

	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = scSelect;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var template = '\n  <div ng-class="{\'input-group select2-bootstrap-append\': vm.canToggleAll}">\n    <ui-select\n      ng-model="vm.selected"\n      ng-change="vm.modelChanged()"\n      ng-disabled="vm.ngDisabled"\n      theme="select2"\n      class="form-control"\n      search-enabled="vm.searchEnabled">\n      <ui-select-match placeholder="{{ vm.placeholder }}">\n        {{ vm.getMappedItem($item || $select.selected) }}\n      </ui-select-match>\n      <ui-select-choices\n        repeat="item in vm.items | filter: $select.search"\n        refresh="vm.searchItems()"\n        refresh-delay="vm.refreshDelay || 200"\n        group-by="vm.groupBy">\n        <div ng-bind-html="vm.getMappedItem(item) | highlight: $select.search"></div>\n      </ui-select-choices>\n    </ui-select>\n    <span class="input-group-btn" ng-if="vm.canToggleAll">\n      <button\n        ng-click="vm.selectAll()"\n        class="btn btn-default"\n        type="button"\n        style="height: calc(100% + 14px)">\n        <i class="fa fa-check-square-o"></i>\n      </button>\n      <button\n        ng-click="vm.deselectAll()"\n        class="btn btn-default"\n        type="button"\n        style="height: calc(100% + 14px)">\n        <i class="fa fa-square-o"></i>\n      </button>\n    </span>\n  </div>\n';

	function scSelect() {

	  'ngInject';

	  return {
	    restrict: 'E',
	    require: 'ngModel',
	    template: '<div></div>',
	    controller: ["$attrs", "$element", "$compile", "$parse", "$scope", "$q", "$timeout", "scSelectParser", function controller($attrs, $element, $compile, $parse, $scope, $q, $timeout, scSelectParser) {

	      'ngInject';

	      var vm = this;
	      var loadingDelay = _angular2['default'].isDefined(vm.loadingDelay) ? vm.loadingDelay : 0;
	      vm.currentPage = 1;
	      vm.canToggleAll = vm.multiple && !vm.pageLimit;

	      var selectElm = _angular2['default'].element(template);
	      if (vm.multiple) {
	        selectElm.find('ui-select').attr('multiple', 'multiple');
	      }
	      $compile(selectElm)($scope);
	      $element.append(selectElm);

	      vm.items = [];

	      var oldSearchText = undefined;

	      vm.searchItems = function () {
	        if (vm.uiSelectCtrl) {
	          var _ret = (function () {
	            //reset page if the search text has changed
	            if (oldSearchText !== vm.uiSelectCtrl.search) {
	              vm.currentPage = 1;
	            }

	            oldSearchText = vm.uiSelectCtrl.search;
	            var setLoadingTimeout = $timeout(function () {
	              vm.loading = true;
	              vm.items = [];
	            }, loadingDelay);

	            return {
	              v: $q.when(vm.parsedOptions.source(vm.optionScope, {
	                page: vm.currentPage,
	                searchText: vm.uiSelectCtrl.search
	              })).then(function (items) {
	                vm.items = items;
	              })['finally'](function () {
	                vm.loading = false;
	                $timeout.cancel(setLoadingTimeout);
	              })
	            };
	          })();

	          if (typeof _ret === 'object') return _ret.v;
	        }
	      };

	      vm.changePage = function (newPage) {
	        vm.currentPage = newPage;
	        vm.searchItems();
	      };

	      vm.parsedOptions = scSelectParser.parse($attrs.scOptions);

	      vm.setOptionScope = function (scope) {
	        vm.optionScope = scope; //expose for testing
	        vm.changePage(vm.currentPage);
	      };

	      vm.setNgModelCtrl = function (ngModelCtrl) {
	        vm.ngModelCtrl = ngModelCtrl;

	        ngModelCtrl.$render = function () {

	          if (!ngModelCtrl.$viewValue) {
	            return;
	          }

	          var matchingItems = vm.items.filter(function (item) {
	            var itemValue = vm.parsedOptions.modelMapper(_defineProperty({}, vm.parsedOptions.itemName, item));
	            if (vm.multiple) {
	              if (!ngModelCtrl.$viewValue) {
	                return false;
	              }
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

	        //Ensure items array has been populated first - as it uses $q.when it will be after the first digest
	        $timeout(function () {
	          vm.ngModelCtrl.$render();
	        });
	      };

	      vm.modelChanged = function () {
	        var modelValue = undefined;
	        if (vm.multiple) {
	          modelValue = vm.selected.map(function (item) {
	            return vm.parsedOptions.modelMapper(_defineProperty({}, vm.parsedOptions.itemName, item));
	          });
	        } else {
	          modelValue = vm.parsedOptions.modelMapper(_defineProperty({}, vm.parsedOptions.itemName, vm.selected));
	        }
	        vm.ngModelCtrl.$setViewValue(modelValue);
	      };

	      vm.getMappedItem = function (localItem) {
	        return vm.parsedOptions.viewMapper(_defineProperty({}, vm.parsedOptions.itemName, localItem));
	      };

	      vm.selectAll = function () {
	        vm.selected = vm.items;
	        vm.modelChanged();
	      };

	      vm.deselectAll = function () {
	        vm.selected = [];
	        vm.modelChanged();
	      };

	      if (!_angular2['default'].isDefined(vm.pageLimit)) {
	        $scope.$watch(function () {
	          return vm.parsedOptions.source(vm.optionScope);
	        }, function (items) {
	          if (items) {
	            vm.items = items;
	          }
	        });
	      }

	      if (_angular2['default'].isUndefined(vm.groupBy) && _angular2['default'].isDefined($attrs.groupBy)) {
	        (function () {
	          var getGroupBy = $parse($attrs.groupBy);
	          vm.groupBy = function (item) {
	            return getGroupBy(item);
	          };
	        })();
	      }
	    }],
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
	    link: function link(scope, elm, attrs, ngModelCtrl) {
	      scope.vm.setNgModelCtrl(ngModelCtrl);
	    }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = scOptions;

	function scOptions() {

	  'ngInject';

	  return {
	    restrict: 'A',
	    require: 'scSelect',
	    link: function link(scope, elm, attrs, scSelectCtrl) {
	      scSelectCtrl.setOptionScope(scope);
	    }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = scSelectPaginator;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	function scSelectPaginator() {

	  'ngInject';

	  return {
	    restrict: 'E',
	    require: ['?^scSelect', '^uiSelect'],
	    template: '\n        <div\n          ng-show="vm.scSelectCtrl.loading"\n          style="padding: 10px"\n          class="text-center">\n          <i class="fa fa-spin fa-spinner"></i> <b>Loading...</b>\n        </div>\n        <div\n          ng-style="{padding: vm.scSelectCtrl.multiple ? \'10px\' : \'10px 0\'}"\n          ng-if="vm.scSelectCtrl && vm.scSelectCtrl.pageLimit"\n          ng-show="vm.scSelectCtrl.items.length > 0">\n          <div class="btn-group">\n            <button\n             class="btn btn-default btn-xs"\n             ng-click="vm.scSelectCtrl.changePage(vm.scSelectCtrl.currentPage - 1)"\n             ng-disabled="vm.scSelectCtrl.currentPage <= 1">\n              <i class="fa fa-arrow-left"></i> Prev\n            </button>\n            <button\n            class="btn btn-default btn-xs"\n            ng-click="vm.scSelectCtrl.changePage(vm.scSelectCtrl.currentPage + 1)"\n            ng-disabled="vm.scSelectCtrl.currentPage >= (vm.scSelectCtrl.totalItems / vm.scSelectCtrl.pageLimit)">\n              Next <i class="fa fa-arrow-right"></i>\n            </button>\n          </div>\n          <small class="pull-right">\n            {{ (vm.scSelectCtrl.currentPage - 1) * vm.scSelectCtrl.pageLimit + 1 }} -\n            {{ vm.scSelectCtrl.currentPage * vm.scSelectCtrl.pageLimit > vm.scSelectCtrl.totalItems ? vm.scSelectCtrl.totalItems : vm.scSelectCtrl.currentPage * vm.scSelectCtrl.pageLimit }} of\n            {{ vm.scSelectCtrl.totalItems }} results\n           </small>\n        </div>\n      ',
	    scope: {},
	    bindToController: true,
	    controller: _angular2['default'].noop,
	    controllerAs: 'vm',
	    link: function link(scope, elm, attrs, ctrls) {
	      if (ctrls[0]) {
	        scope.vm.scSelectCtrl = ctrls[0];
	        ctrls[0].uiSelectCtrl = ctrls[1];
	      }
	    }
	  };
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;