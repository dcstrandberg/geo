import angular from 'angular';
import angularMeteor from 'angular-meteor';
import dist from '../imports/components/dist/dist.js';

angular.module('geoApp', [
    angularMeteor,
    dist.name
]);

/*
function getDistance(locObj) {
        var dist, lat0, long0, earthRadius = 6371000; //Meters 
                     
        //Get the location coordinates
        lat0 = locObj.coords.latitude;
        long0 = locObj.coords.longitude;
        
        //Get the differences in lat and long and convert to radians
        var deltaLat = (homeLat - lat0) * Math.PI / 180;
        var deltaLong = (homeLong - long0) * Math.PI / 180;
        
        var a = 
            0.5 - Math.cos(deltaLat)/2 + 
            Math.cos(lat0 * Math.PI / 180) * Math.cos(homeLat * Math.PI / 180) * 
            (1 - Math.cos(deltaLong))/2;
        //Round the distance to 1 decimal point
        var dist = (earthRadius * 2 * Math.asin( Math.sqrt(a) ) ).toFixed(1);
        //Add the units
        return (dist + " m");
    }

*/