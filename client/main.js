import angular from 'angular';
import angularMeteor from 'angular-meteor';

import geo from '../imports/components/geo/geo.js';
import '../imports/startup/accounts-config.js';

angular.module('geoApp', [
    angularMeteor,
    geo.name,
    'accounts.ui'
]);