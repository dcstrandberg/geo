import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Locations } from '../../api/locations.js';
import DistService from '../../services/distService.js';

import template from './dist.html';

class DistCtrl {
    constructor($scope, distService) {
        //'ngInject';
        
        //$reactive(this).attach($scope);
        $scope.viewModel(this);
        var vm = this;
        
        this.name = "David";
        this.error = distService.errMsg;
        /*this.nonDBGeo = {
            "lat": "",
            "long": ""
        };*/
        this.on = false;
                
        this.compassOff = function() {
            //Use the service to clear the geo watch
            distService.clearGeo(this.watchID);
            vm.on = false;
            vm.error = this.getReactively('distService.errMsg');            

        };
        this.compassOn = function() {
            //Call the distService to get the geo Obj
            //Pass it the username of the current user
            distService.getGeo(this.name);
            
            //Update variables
            vm.on = true;
            vm.error = this.getReactively('distService.errMsg');            
        };
        
        this.helpers({
            me() { 
                if (Locations.findOne({name: vm.name}) && 
                    vm.getReactively('on')) {
                    return Locations.findOne({name: vm.name});
                } else {
                    return {
                        'name': vm.name, 
                        'geo': {
                            'lat': '...', 
                            'long': '...'
                        }
                    };
                }
            },
            locations() { //Should return distance and not lat/long - Eventually the distance calculations will be performed on the server, which should be more secure...??
                return Locations.find({
                    'name': {
                        $ne: vm.name
                    }
                });
            },
            distances() {//Use the Locations helper and the Me helper to compute distances
                if (vm.getReactively('on')) {
                    return Locations.find({
                        'name': vm.name
                        });
                        
                } else {
                    return;
                }
            }          
        });
    }
}

export default angular.module('dist', [
    angularMeteor
]).factory('distService', 
    DistService
).component('dist', {
    templateUrl: 'imports/components/dist/dist.html',
    controller: ['$scope', 'distService', DistCtrl]
});