import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import lastUpdated from '../lastUpdated/lastUpdated.js';
import { Locations } from '../../api/locations.js';
import DistService from '../../services/distService.js';

import template from './dist.html';

class DistCtrl {
    constructor($scope, distService, $window) {
        //'ngInject';
        
        //$reactive(this).attach($scope);
        $scope.viewModel(this);
        var vm = this;
        //Subscribe to the tasks
        this.subscribe('locations');
        
        this.error = distService.errMsg;
        this.on = false;
                
        this.compassOff = function() {
            if (vm.on === true) {//Only do a thing if we're currently On
            //IT USED TO REQUIRE A LOGGED IN USER AS WELL, BUT I DON'T SEE WHAT EXTRA SAFETY THAT PROVIDES.... I'll THINK ABOUT IT
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
        
        this.matchUser = function(user) {
            //Add the matched property to the user in distList
            //Call a meteor method to do it server-side
            Meteor.call('locations.matchUser', user);
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
            distances() {//Call the Meteor method to get the distances from the DB
                if (vm.getReactively('on')) {
                   //return Meteor.call('locations.distances');
                    if (!Meteor.userId()) {
                        throw new Meteor.Error('Please Log In');
                    } else {
                        var distances = [];
                        Locations.find({
                            'UID': Meteor.userId()
                        }, {
                            '_id': 0,//Don't return _id
                            'distList': 1//DO return distList
                        }).forEach(function(list) {
                            distances = list.distList;
                        });
                        return distances;
                    }
                } else {
                    return "";
                }
            },
            loggedInUser() {//Only used right now to show distances only if the user's logged in
                return Meteor.user();
            } 
        });//End of helpers
        //When the page gets reloaded or closed, run the OFF function
        $scope.$on('$destroy', function() {
            if (vm.on) {
                distService.clearGeo();
            }
        });
        $window.onbeforeunload = function(evt) {
            vm.compassOff();
        }
    }//End of constructor
}//End of class

export default angular.module('dist', [
    angularMeteor,
    lastUpdated.name
]).factory('distService', 
    DistService
).component('dist', {
    template,
    //templateUrl: 'imports/components/dist/dist.html',
    controller: ['$scope', 'distService', '$window', DistCtrl]
});