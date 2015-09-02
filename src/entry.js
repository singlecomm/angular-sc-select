import angular from 'angular';

angular
  .module('sc.select', [])
  .run(function($log) {
    $log.info('Hello world!');
  });
