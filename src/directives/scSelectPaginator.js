import angular from 'angular';

export default function scSelectPaginator() {

  'ngInject';

  return {
    restrict: 'E',
    require: ['?^scSelect', '^uiSelect'],
    template: `
        <div
          ng-show="vm.scSelectCtrl.loading"
          style="padding: 10px"
          class="text-center">
          <i class="fa fa-spin fa-spinner"></i> <b>Loading...</b>
        </div>
        <div
          ng-style="{padding: vm.scSelectCtrl.multiple ? '10px' : '10px 0'}"
          ng-if="vm.scSelectCtrl && vm.scSelectCtrl.pageLimit"
          ng-show="vm.scSelectCtrl.items.length > 0">
          <div class="btn-group">
            <button
             class="btn btn-default btn-xs"
             ng-click="vm.scSelectCtrl.changePage(vm.scSelectCtrl.currentPage - 1)"
             ng-disabled="vm.scSelectCtrl.currentPage <= 1">
              <i class="fa fa-arrow-left"></i> Prev
            </button>
            <button
            class="btn btn-default btn-xs"
            ng-click="vm.scSelectCtrl.changePage(vm.scSelectCtrl.currentPage + 1)"
            ng-disabled="vm.scSelectCtrl.currentPage >= (vm.scSelectCtrl.totalItems / vm.scSelectCtrl.pageLimit)">
              Next <i class="fa fa-arrow-right"></i>
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
    link: (scope, elm, attrs, ctrls) => {
      if (ctrls[0]) {
        scope.vm.scSelectCtrl = ctrls[0];
        ctrls[0].uiSelectCtrl = ctrls[1];
      }
    }
  };

}
