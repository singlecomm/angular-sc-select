import angular from 'angular';

describe('scOptions directive', () => {

  let scope, elm, selectCtrl;

  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();
    scope.vm = {
      items: []
    };
    const template = `<sc-select ng-model="vm.value" sc-options="item for item in vm.items"></sc-select>`;
    elm = angular.element(template);
    $compile(elm)(scope);
    scope.$apply();
    selectCtrl = elm.isolateScope().vm;
  }));

  it('should pass the outer scope to the sc-select controller', () => {
    expect(selectCtrl.optionScope).to.equal(scope);
  });

});
