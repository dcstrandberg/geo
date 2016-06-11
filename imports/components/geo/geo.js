import angular from 'angular';
import angularMeteor from 'angular-meteor';

import dist from '../dist/dist.js';
import template from './geo.html';

class GeoCtrl {
    constructor() {}
}

const name = 'geo';

//Create the module

export default angular.module(name, [
    angularMeteor,
    dist.name
]).component(name, {
    template,
    controllerAs: name,
    controller: GeoCtrl
});