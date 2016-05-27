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
            vm.error = distService.errMsg;            

        };
        this.compassOn = function() {
            //Call the distService to get the geo Obj
            //Pass it the username of the current user
            distService.getGeo(this.name);
            
            //Update variables
            vm.on = true;
            vm.error = distService.errMsg;            
        };

        
        this.helpers({
            me() { 
                if (Locations.findOne({name: vm.name}) && vm.on) {
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
            locations() { //Should return distance and not lat/long - Eventually the distance calculations will be performed on the server, which should be more secure...
                return Locations.find({
                    'name': {
                        $ne: vm.name
                    }
                });
            }
            
            
        });

        /*this.computeDist = function(locObj) {
            //enclosed function to accept the geolocation object and update the display accordingly
            const EARTHRADIUS = 6371000; //Meters
            const HOMELAT = 44.940601, HOMELONG = -93.156662;
            var dist, lat0, long0;  
                     
            //Get the location coordinates
            lat0 = locObj.coords.latitude;
            long0 = locObj.coords.longitude;
        
            //Get the differences in lat and long and convert to radians
            var deltaLat = (HOMELAT - lat0) * Math.PI / 180;
            var deltaLong = (HOMELONG - long0) * Math.PI / 180;
        
            var a = 
                0.5 - Math.cos(deltaLat)/2 + 
                Math.cos(lat0 * Math.PI / 180) * Math.cos(HOMELAT * Math.PI / 180) * 
                (1 - Math.cos(deltaLong))/2;
            //Round the distance to 1 decimal point
            var dist = 
                (EARTHRADIUS * 2 * Math.asin( Math.sqrt(a) ) ).toFixed(1);
            //Add the units
            return dist + " m";
        };
        
        this.onError = (err) => {
            return "Error(" + err.code + "): " + err.message;
        };*/
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