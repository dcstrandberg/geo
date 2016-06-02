import angular from 'angular';
import angularMeteor from 'angular-meteor';
import dist from '../imports/components/dist/dist.js';
import '../imports/startup/accounts-config.js';

angular.module('geoApp', [
    angularMeteor,
    dist.name,
    'accounts.ui'
]);