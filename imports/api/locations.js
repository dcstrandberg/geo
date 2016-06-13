import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Locations = new Mongo.Collection('locations');

if (Meteor.isServer) {
    //This code only runs on the server
    Meteor.publish('locations', function locationsPublication() {
        return Locations.find({//I COULD MODIFY THIS SO THAT ONLY THE DISTLIST GETS PUBLISHED AND THEN THE CURRENT GEO OBJECT COULD JUST BE FED TO THE VIEW FROM THE DISTSERVICE INSTEAD OF FROM THE DB. THAT MIGHT BE SAFER SO THAT NEVER DOES THE CONTROLLER READ THE GEO OBJECT FROM THE DB. INSTEAD IT JUST GETS THE DISTANCES...
            'UID': this.userId
        }/*,{
            fields: {
                'distList': 1 //This would only return the distList and _id of }the entry, but currently we need the full entry for the me() helper, so I've commented it out
            }
        }*/);
        //Publish only the logged in user's entry
    });
}

Meteor.methods({
    'locations.matchUser' (/*currentUser,*/ userObj) {
        check(userObj, Object);
        /*check(currentUser, Object);*/
        //Only perform method if the user sending the request is the same one that's logged in. 
        if (Meteor.userId()) {
            Locations.update({
                'UID': Meteor.userId(),
                'distList.UID': userObj.UID
            }, { 
                $set: {
                    //Toggle the matched property in the distList
                    'distList.$.matched': !userObj.matched
                }
            });
        } else {
            console.log("Error: Cannot Match User. Please log in.");
        }
    },
    'locations.setLocation' (userObj) {
        check(userObj, Object);

        if (userObj.UID === Meteor.userId()) {//Make sure the userObj passed and the logged in user are the same user
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
        } else {
            console.log("Error: Cannot set location. User mismatch.");
        }    
    },
    'locations.createDistList' (userID) {
        check(userID, String);
        
        if (userID === Meteor.userId()) {//Make sure logged in user is the one we're generating the distList for. 
            var distList = []; 
            var myEntry = Locations.findOne({"UID": userID});
            var userArray = Locations.find({
                'UID': {
                    $ne: userID
                }
            });
            
            //Only want to update the user entries whose distances have changed
            //Go through the array of other users first and check their 
            //current distances against the current user's distList
            userArray.forEach(function(user) {
                //First compute the current distance
                var newDist = computeDist(myEntry.geo, user.geo);
                
                //FIXME: Need to include logic to only add users within X miles

                //Then find if the user is already in the distList
                var oldUser = myEntry.distList.find(function(distUser) {
                    //Return true if the UIDs matched
                    if (distUser.UID === user.UID) {
                        return true;
                    } else {
                        return false;
                    }   
                });
                if (oldUser) {//If the newUser's already in distList
                    
                    //Check if the distance has changed, and if so update the DB
                    if (oldUser.distance !== newDist) {//FIXME: This should be where we check to see if the distance is still within the radius, and if not, we remove that user from distList
                        Locations.update({
                            '_id': myEntry._id,
                            'distList.UID': user.UID
                        }, {
                            $set: {
                                'distList.$.distance': newDist,
                                'distList.$.lastActive': user.updated
                            }
                        });
                    }
                } else {//If the newUser isn't already added to distList
                    //Add their name, distance, and matched=false info to the distList array
                    
                    Locations.update({
                        '_id': myEntry._id,
                    }, {
                        $push: {
                            'distList': {
                                'UID': user.UID,
                                'name': user.name,
                                'distance': newDist,
                                'matched': false,
                                'lastActive': user.updated
                            }
                        }
                    });   
                }
            });
        } else {//If the current user's not the one trying to modify distList
            console.log("Error: Cannot create distList. User mistmatch.");
            throw new Meteor.Error('Cannot create distList. User mismatch.');
        }
    },
    'locations.clearDistList' (userID) {
        if (userID === Meteor.userId()) {
            var myEntry = Locations.findOne({"UID": Meteor.userId()});

            Locations.update({
                '_id': myEntry._id
            }, {
                $set: {
                    'distList': [] //Empty the distList
                }            
            });
        } else {
            console.log("Error: Cannot clear DistList. User mismatch.");
        }
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
