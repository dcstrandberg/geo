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
            'distList.name': userObj.name
        }, { 
            $set: {
                //Toggle the matched property in the distList
                'distList.$.matched': !userObj.matched
            }
        });
    },
    
});