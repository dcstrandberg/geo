import angular from 'angular';
import angularMeteor from 'angular-meteor';
import dist from '../imports/components/dist/dist.js';

angular.module('geoApp', [
    angularMeteor,
    dist.name
]);