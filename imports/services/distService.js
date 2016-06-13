import angular from 'angular';
import angularMeteor from 'angular-meteor';

function DistService() {
    var vm = this;
        var distSettings = { //Settings for grabbing the geolocation obj
            enableHighAccuracy: true,
            timeout: 20000, //Timeout of 20s
            maximumAge: 0//Always fetch a new location
        };
        var watchID;
        
        this.errMsg = "";
 
        //When On is clicked, this method finds the geo obj
        this.getGeo = () => {
            if (navigator.geolocation) {
                //watchPosition returns an ID for clearing it later
                watchID = navigator.geolocation.watchPosition(
                    geoLog, 
                    geoError, 
                    distSettings
                );            
            } else {
                //errMsg is updated when clearGeo is called
                this.errMsg = "Error getting navigator.geolocation!";
                console.log("Error generated when seeing if 'navigator.geolocation' exists");
            }
            
        };
            
        //When Off is clicked this method gets called
        this.clearGeo = () => {
            navigator.geolocation.clearWatch(watchID);
            //Meteor.call('locations.clearDistList', Meteor.userId());
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
            createDistList();
            return "";  
        }
        
        function geoError(err) {
            //Errors get updated here, and then they register in the view when Off is called
            console.log("Error registered in callback function:" + err.code + ": " + err.message);
            this.errMsg = "Error registered in callback function:" + err.code + ": " + err.message;
        }
        
        function createDistList() {
            //Call the Meteor Method to generate and write the distList
            //Pass it with the parameter of the current user's UID
            Meteor.call('locations.createDistList', Meteor.userId() );
            return "";
        }
        
    //Return the service object
    return this;
}

export default DistService; 