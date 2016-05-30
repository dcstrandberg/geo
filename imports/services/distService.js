import { Locations } from '../api/locations.js';

function DistService() {
    var vm = this;
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
            createDistList(); 
            return "";  
        }
        
        function geoError(err) {
            
            //Perhaps it should write the error to the DB because that would be better?
            
            console.log("Error registered in callback function:" + err.code + ": " + err.message);
            this.errMsg = "Error registered in callback function:" + err.code + ": " + err.message;
        }

        //ORIGINALLY THIS WAS GOING TO JUST BE A NON OBJECT FUNCTION, BUT SINCE IT NEEDS TO BE CALLED FROM THE COMPONENT, FOR NOW IT WILL BE MADE INTO A METHOD.
        this.computeDist = function (myGeo, userGeo) {
            //enclosed function to accept the geolocation object and update the display accordingly
            const EARTHRADIUS = 6371000; //Meters
            var myLat = myGeo.lat, myLong = myGeo.long;
            //var HOMELAT = 42, HOMELONG = -93;
            
            var dist;  
                     
            //Get the location coordinates
            var lat0 = userGeo.lat;
            var long0 = userGeo.long;
        
            //Get the differences in lat and long and convert to radians
            var deltaLat = (myLat - lat0) * Math.PI / 180;
            var deltaLong = (myLong - long0) * Math.PI / 180;
        
            var a = 
                0.5 - Math.cos(deltaLat)/2 + 
                Math.cos(lat0 * Math.PI / 180) * Math.cos(myLat * Math.PI / 180) * (1 - Math.cos(deltaLong))/2;
            //Round the distance to 1 decimal point
            var dist = 
                (EARTHRADIUS * 2 * Math.asin( Math.sqrt(a) ) ).toFixed(1);
            //Add the units
            return dist + " m";
        };
        function createDistList() {
            var distList = [], i; 
            var myEntry = Locations.findOne({"name": name});
            var userArray = Locations.find({
                'name': {
                    $ne: name
                }
            });
            userArray.forEach(function(user) {
                distList.push({
                    'name': user.name,
                    'distance': vm.computeDist(myEntry.geo, user.geo)
                });
            });
            Locations.update({
                "_id": myEntry._id
            }, {
                //Should change this to only update the entries in the distList that need to be updated
                $set: {
                    'distList': distList
                }
            });
            return;
        }
        
    //Return the service object
    return this;
}

export default DistService; 