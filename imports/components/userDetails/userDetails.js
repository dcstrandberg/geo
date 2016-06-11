import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './userDetails.html';

class UserDetails {
    constructor($stateParams) {
        'ngInject';
        
        this.userId = $stateParams.userId;
    }
}

const name = "userDetails";

//create the module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$stateParams', UserDetails]
})
    .config(['$stateProvider', config]);
    
function config($stateProvider) {
    'ngInject';
    
    $stateProvider.state('userDetails', {
        url: '/geo/:userId',
        template: '<user-details></user-details>'
    });
}