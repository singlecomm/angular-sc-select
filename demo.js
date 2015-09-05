import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import scSelect from './src/module';
import 'angular-sanitize';
import 'ui-select';
import 'ui-select/dist/select.css';

angular
  .module('demo', [scSelect])
  .controller('DemoCtrl', /*@ngInject*/ function($http) {

    var vm = this;
    vm.people = [
      {name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States'},
      {name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina'},
      {name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina'},
      {name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador'},
      {name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador'},
      {name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States'},
      {name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia'},
      {name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador'},
      {name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia'},
      {name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia'}
    ];

    vm.asyncPageLimit = 10;
    vm.totalResults = 0;

    vm.searchAsync = function(searchText, page) {
      if (!searchText) {
        return [];
      }

      return $http.jsonp('http://ws.audioscrobbler.com/2.0/', {
        params: {
          api_key: '9b0cdcf446cc96dea3e747787ad23575',
          track: searchText,
          limit: vm.asyncPageLimit,
          method: 'track.search',
          page: page,
          format: 'json',
          callback: 'JSON_CALLBACK'
        }
      }).then(function(result) {
        vm.totalResults = result.data.results['opensearch:totalResults'];
        return result.data.results.trackmatches.track;
      });
    };

    vm.groupBy = function(item) {
      if (item.name[0] >= 'A' && item.name[0] <= 'M') {
        return 'From A - M';
      }
      if (item.name[0] >= 'N' && item.name[0] <= 'Z') {
        return 'From N - Z';
      }
    };

  });
