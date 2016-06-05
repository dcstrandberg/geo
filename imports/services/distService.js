import angular from 'angular';
import angularMeteor from 'angular-meteor';
//import { Locations } from '../api/locations.js';
//I don't think we need this anymore since we just call the methods...

function DistService() {
    var vm = this;
        //var userId; //Getting rid of this because I'm just calling Meteor.userId() directly rather than getting it passed. I might even end up just calling it in the database methods...
        var distSettings = { //Settings for grabbing the geolocation obj
            enableHighAccuracy: true,
            timeout: 4000,
            maximumAge: 0
        };
        var watchID;
        
        this.errMsg = "";
 
        //When On is clicked, this method finds the geo obj
        this.getGeo = () => {
            //First assign the name variable so we can use it in the callback functions
            //userId = UID;
            
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
            Meteor.call('locations.clearDistList', Meteor.userId());
        };        
        
        
        
        //CALLBACK FUNCTIONS
        function geoLog(locObj) {
            //Define a user object to pass to the Meteor Method
            userObj = {
                'UID': Meteor.userId(),
                'name': Meteor.user().username,
                'geo': {
                    'lat': locObj.coords.latitude,
                    'long': locObj.coords.longitude
                }
            };
            Meteor.call('locations.setLocation', userObj);
            createDistList();//EVERYTIME this gets called, it will update our distList. It should get called everytime OUR geolocation changes. So. there's that...
            return "";  
        }
        
        function geoError(err) {
            
            //Perhaps it should write the error to the DB because that would be better?
            
            console.log("Error registered in callback function:" + err.code + ": " + err.message);
            this.errMsg = "Error registered in callback function:" + err.code + ": " + err.message;
        }
        
        function createDistList() {
            //Call the Meteor Method to generate and write the distList
            //Pass it with the parameter of the current user's name
            Meteor.call('locations.createDistList', Meteor.userId() );
            return "";
        }
        
    //Return the service object
    return this;
}

export default DistService; 