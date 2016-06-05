import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import lastUpdated from '../lastUpdated/lastUpdated.js';

import { Locations } from '../../api/locations.js';
import DistService from '../../services/distService.js';

import template from './dist.html';

class DistCtrl {
    constructor($scope, distService) {
        //'ngInject';
        
        //$reactive(this).attach($scope);
        $scope.viewModel(this);
        var vm = this;
        
        //this.UID = this.getReactively('Meteor.userId()');//I wanted to only call Meteor.userId() once, but it wasn't reactively updating this variable.
        this.error = distService.errMsg;
        this.on = false;
                
        this.compassOff = function() {
            if (vm.on === true && Meteor.userId()) {//Only do a thing if we're currently On & the user's logged in
                //Use the service to clear the geo watch
                distService.clearGeo();
                vm.on = false;
                vm.error = this.getReactively('distService.errMsg');            
            }
        };
        this.compassOn = function() {
            if (vm.on === false && Meteor.userId()) {//Only do a thing if we're currently Off & the user's logged in
                //Call the distService to get the geo Obj
                //Pass it the username of the current user
                distService.getGeo(); 
            
                //Update variables
                vm.on = true; //I SHOULD MAKE THIS UPDATE ONCE I'M SURE THE DATABASE IS FRESH, OR I SHOULD NOT HAVE THE HELPERS FUNCTION DEPEND ON vm.on
                vm.error = this.getReactively('distService.errMsg');            
            }
        };
        
        this.matchUser = function(currentUser, user) {
            //Add the matched property to the user in distList
            //Call a meteor method to do it server-side
            Meteor.call('locations.matchUser', currentUser, user);
        };
        
        this.helpers({
            me() { 
                if ( this.getReactively('loggedInUser') ) {//If the user's logged in show stuff
                    if (Locations.findOne({ 'UID': Meteor.userId() }) && 
                        vm.getReactively('on') ) {
                        return Locations.findOne({ 'UID': Meteor.userId() });
                    } else {
                        return {
                            'name': Meteor.user().username, 
                            'geo': {
                                'lat': '...', 
                                'long': '...'
                            }
                        };
                    }
                } else {
                    return {
                        'name': "Please Log In",
                        'geo': {
                            'lat': '...',
                            'long': '...'
                        }
                    };
                }
            },
            distances() {//Use the Locations helper and the Me helper to compute distances
               // if (vm.getReactively('on')) {
                    return Locations.find({
                        'UID': Meteor.userId()
                        });
                        
                /*} else {
                    return "";
                }*/
            },
            loggedInUser() {//Only used right now to show distances only if the user's logged in
                return Meteor.user();
            } 
        });
    }
}

export default angular.module('dist', [
    angularMeteor,
    lastUpdated.name
]).factory('distService', 
    DistService
).component('dist', {
    templateUrl: 'imports/components/dist/dist.html',
    controller: ['$scope', 'distService', DistCtrl]
});