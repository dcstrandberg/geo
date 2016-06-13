import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './userDetails.html';
import { Locations } from '../../api/locations.js';

class UserDetails {
    constructor($stateParams, $scope, $reactive) {
        'ngInject';
        
        $reactive(this).attach($scope);
        vm = this;
        this.subscribe('locations');
        
        this.helpers({
            user() {
                //console.log("MeteorID " + Meteor.userId());
                var i =  Locations.findOne({//COULDN'T USE A METEOR METHOD CALL
                    'UID': Meteor.userId()//BECAUSE IT RETURNED ASYNCHONOUSLY AND MADE EVERYTHING UNDEFINED... JUST FUCKING CALL IT INSTEAD
                });
                //CURRENTLY THIS ONLY WORKS IF COMING FROM THE MAIN VIEW
                //IF YOU'RE ON THIS VIEW AND YOU RELOAD THE PAGE, IT ERRORS OUT
                //THE DB QUERY RETURNS UNDEFINED...
                return i.distList.find(function(u) {
                    if (u.UID === $stateParams.userId) {
                        return true;
                    } else {
                        return false;
                    }
                });//Return the desired user entry from the distList
            }
        });//End of helpers
    }//End of constructor
}//End of class UserDetails

const name = "userDetails";

//create the module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$stateParams', '$scope', '$reactive', UserDetails]
})
    .config(['$stateProvider', config]);
    
function config($stateProvider) {
    'ngInject';
    
    $stateProvider.state('userDetails', {
        url: '/geo/:userId',
        template: '<user-details></user-details>'
    });
}