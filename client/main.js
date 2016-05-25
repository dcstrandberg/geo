import angular from 'angular';
import angularMeteor from 'angular-meteor';
import dist from '../imports/components/dist/dist';

angular.module('geoApp', [
    angularMeteor,
    dist.name
]);
/*

var i=0, watchID;
var demoRef = document.getElementById("demo");

var homeLat = 44.940601, homeLong = -93.156662;
var settings = {
    enableHighAccuracy: false,
    timeout: 4000,
    maximumAge: 0
};

function compassOff() {
    //Also switch the button classes
    document.getElementById("off").className = "active";
    document.getElementById("on").className = "inactive";
    
    //When Off is pressed, clear the watcher and reset the HTML
    navigator.geolocation.clearWatch(watchID);
    demoRef.innerHTML = "...";

}

function updateText(loc) {
    demoRef.innerHTML = getDistance(loc);
}

function compassOn() {
        if (navigator.geolocation) {
            //watchPosition returns an ID for clearing it later
            watchID = navigator.geolocation.watchPosition(updateText, onError, settings);/*function(loc) { //Anonymous callback function that saves the position object to a property of the user class
                demoRef.innerHTML = getDistance(loc);
                }
            );*/    
            //Also switch the button classes
/*            document.getElementById("off").className = "inactive";
            document.getElementById("on").className = "active";
        } else {
            demoRef.innerHTML = "Error!";
        }
    return;
}

function onError(err) {
    demoRef.innerHTML = "Error(" + err.code + "): " + error.message;
}    
    
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