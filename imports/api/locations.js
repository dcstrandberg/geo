import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Locations = new Mongo.Collection('locations');

Meteor.methods({
    'locations.matchUser' (currentUser, userObj) {
        check(userObj, Object);
        check(currentUser, Object);
        
        Locations.update({
            '_id': currentUser._id,
            'distList.UID': userObj.UID
        }, { 
            $set: {
                //Toggle the matched property in the distList
                'distList.$.matched': !userObj.matched
            }
        });
    },
    'locations.setLocation' (userObj) {
        check(userObj, Object);
        
        //If the entry for me doesn't exist yet, create one
        if (Locations.find({'UID':userObj.UID}).count() === 0) {
            //Add date modified property
            userObj.updated = new Date;
            //Insert the document into the database            
            Locations.insert(userObj);
        } else {
            //If the entry *does* exist:
            var id = Locations.findOne({'UID':userObj.UID})._id;
            Locations.update({
                '_id': id
            }, {
                $set: {
                    'geo': {
                        'lat': userObj.geo.lat,
                        'long': userObj.geo.long
                    },
                    'updated': new Date()
                }
            });
        }    
    },
    'locations.createDistList' (userID) {
        check(userID, String);
        
        var distList = []; 
        var myEntry = Locations.findOne({"UID": userID});
        var userArray = Locations.find({
            'UID': {
                $ne: userID
            }
        });
        //For each user document in the DB that's not the current user
        //Add their name, distance, and matched=false info to the distList array
        userArray.forEach(function(user) {
            distList.push({
                'UID': user.UID,
                'name': user.name,
                'distance': computeDist(myEntry.geo, user.geo),
                'matched': false,
                'lastActive': user.updated
            });
        });
        //Create a distlist property for the current user
        Locations.update({
            "_id": myEntry._id
        }, {
            //Should change this to only update the entries in the distList that need to be updated
            $set: {
                'distList': distList
            }
        });
        
    },
    'locations.clearDistList' () {
        var myEntry = Locations.findOne({"UID": Meteor.userId()});

        Locations.update({
            '_id': myEntry._id
        }, {
            $set: {
                'distList': [] //Empty the distList
            }            
        });
    }
});
//Define the function so that the server can compute the distance
function computeDist(myGeo, userGeo) {
    //enclosed function to accept the geolocation object and update the display accordingly
    const EARTHRADIUS = 6371; //Kilometers
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
        (EARTHRADIUS * 2 * Math.asin( Math.sqrt(a) ) ); //Got rid of toFixed because an angularjs filter can do the same thing in HTML
           
    return Number( dist );//Make sure to return a # for sorting purposes
}
