import 'jquery';
import angular from 'angular';
import 'angular-mocks';
import 'angular-sanitize';
import 'ui-select';
import './module';

beforeEach(angular.mock.module('sc.select')); //eslint-disable-line no-undef

const testsContext = require.context('./', true, /\.spec/); //eslint-disable-line no-undef
testsContext.keys().forEach(testsContext);
