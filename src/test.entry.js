import 'angular';
import 'angular-mocks';
import './module';

const testsContext = require.context('./', true, /\.spec/); //eslint-disable-line no-undef
testsContext.keys().forEach(testsContext);
