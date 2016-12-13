Meteor.publish('participants.public', function() {
  return Participants.find({});
});
