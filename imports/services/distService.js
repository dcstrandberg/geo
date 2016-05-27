//import '../../client/main.js';

import { Locations } from '../api/locations.js';

function DistService() {
        var name; //Maybe the USERID would be better
        var distSettings = { //Settings for grabbing the geolocation obj
            enableHighAccuracy: true,
            timeout: 4000,
            maximumAge: 0
        };
        var watchID;
        
        this.errMsg = "";
 
        //When On is clicked, this method finds the geo obj
        this.getGeo = (user) => {
            //First assign the name variable so we can use it in the callback functions
            name = user;
            
            if (navigator.geolocation) {
                //watchPosition returns an ID for clearing it later
                watchID = navigator.geolocation.watchPosition(
                    geoLog, 
                    geoError, 
                    distSettings
                );            
            } else {
                //Again, the error needs to be some sort of return or DB write
                this.errMsg = "Error getting navigator.geolocation!";
                console.log("Error generated when seeing if 'navigator.geolocation' exists");
            }
            
        };
            
        //When Off is clicked this method gets called
        this.clearGeo = () => {
            navigator.geolocation.clearWatch(watchID);
        };        
        
        //CALLBACK FUNCTIONS
        function geoLog(locObj) {
            //Can we talk to the database inside this service?! We'll find out
            
            //If the entry for me doesn't exist yet, create one
            if (Locations.find({'name':name}).count() === 0) {
                Locations.insert({
                    'name': name,
                    'geo': {
                        'lat': locObj.coords.latitude,
                        'long': locObj.coords.longitude
                    },
                    'updated': new Date()
                });
            //Otherwise if the entry DOES exist, update it
            } else {
                var id = Locations.findOne({'name':name})._id;
                Locations.update({
                    '_id': id
                }, {
                    $set: {
                        'geo': {
                            'lat': locObj.coords.latitude,
                            'long': locObj.coords.longitude
                        },
                        'updated': new Date()
                    }
                });
            } 
            return "";  
        }
        
        function geoError(err) {
            
            //Perhaps it should write the error to the DB because that would be better?
            
            console.log("Error registered in callback function:" + err.code + ": " + err.message);
            this.errMsg = "Error registered in callback function:" + err.code + ": " + err.message;
        }
return this;
}

export default DistService; /* angular.module('dist')
    .factory('distService', DistService);*/