import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import dist from '../dist/dist.js';
import userDetails from '../userDetails/userDetails.js';

import template from './geo.html';

class GeoCtrl {
    constructor() {}
}

const name = 'geo';

//Create the module

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    dist.name,
    userDetails.name
]).component(name, {
    template,
    controllerAs: name,
    controller: GeoCtrl
})
 .config(['$locationProvider', '$urlRouterProvider', config]);
 
 function config($locationProvider, $urlRouterProvider) {
     'ngInject';
     
     $locationProvider.html5Mode(true);
     
     $urlRouterProvider.otherwise('/geo');
 }