export default function scOptions() {

  'ngInject';

  return {
    restrict: 'A',
    require: 'scSelect',
    link: (scope, elm, attrs, scSelectCtrl) => {
      scSelectCtrl.setOptionScope(scope);
    }
  };

}
