Meteor.methods({
  submitEstimate: function (storyPoints) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Participants.update({ userId: Meteor.userId() }, { $set: { submittedEstimate: true, estimate: storyPoints } });
  },
  deleteAllEstimates: function() {
    Participants.update(
      {},
      { $set: { submittedEstimate: false, storyPoints: null } },
      { multi: true }
    );
  },
  addParticipant: function() {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Participants.insert({
      createdAt: new Date(), // current time
      userId: Meteor.userId(),
      username: Meteor.user().username,
      submittedEstimate: false
    });
  },
  removeParticipant: function(participantId) {
    Participants.remove(participantId);
  }
});
