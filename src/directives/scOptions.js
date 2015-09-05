export default function scOptions() {

  return {
    restrict: 'A',
    require: 'scSelect',
    link: (scope, elm, attrs, scSelectCtrl) => {
      scSelectCtrl.setOptionScope(scope);
    }
  };

}
