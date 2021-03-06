import { Meteor } from 'meteor/meteor';
import { Locations } from '../imports/api/locations.js';

Meteor.startup(() => {
  // code to run on server at startup
  if (Locations.find().count() === 0) {
      const users = [{
          'UID': '',
          'name': 'Amber',
          'geo': {
              'lat': 44.94061,
              'long': -93.156662
          },
          'updated': new Date
      }, {
          'UID': '',
          'name': 'Cody',
          'geo': {
              'lat': 45.95,
              'long': -92.15
          },
          'updated': new Date
      }];

    users.forEach((user) => {
        Locations.insert(user);
    });
  } 
});
