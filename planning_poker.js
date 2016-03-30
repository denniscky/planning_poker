Estimates = new Mongo.Collection("estimates");
Participants = new Mongo.Collection("participants");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
    
  Template.body.events({
    'click .restart': function () {
      Meteor.call("deleteAllEstimates");
    },
  });

  Template.summaryBoard.helpers({
    participants: function () {
      return Participants.find({});
    }
  });

  Template.userDashboard.helpers({
    isJoined: function() {
      return !!Participants.findOne({ userId: Meteor.userId() });
    },
    participant: function() {
      return Participants.findOne({ userId: Meteor.userId() });
    }
  });

  Template.userDashboard.events({
    "click .join": function() {
      Meteor.call("addParticipant");
    }
  });  

  Template.participantForm.helpers({
    submitPrompt: function() {
      return this.submittedEstimate ? "Revise Estimate" : "Submit Estimate";
    }
  });

  Template.participantForm.events({
    "submit .estimate": function (event, template) {
      // Prevent default browser form submit
      event.preventDefault();
 
      let input = {
        submittedEstimate: true,
        zero: template.$('.point0').is(':checked'),
        one: template.$('.point1').is(':checked'),
        two: template.$('.point2').is(':checked'),
        three: template.$('.point3').is(':checked'),
        five: template.$('.point5').is(':checked'),
        eight: template.$('.point8').is(':checked'),
        thirteen: template.$('.point13').is(':checked'),
        na: template.$('.pointNa').is(':checked'),
      };
 
      // Insert a task into the collection
      Meteor.call("submitEstimate", input);
      debugger;
      template.$('.submit').blur();
    },
  });

  Template.card.helpers({
    allParticipantsSubmitted: function() {
      return Participants.find({}).count() === Participants.find({ submittedEstimate: true }).count();
    }
  });

  Template.card.events({
    'click .kill': function() {
      Meteor.call("removeParticipant", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  submitEstimate: function (storyPoints) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Participants.update({ userId: Meteor.userId() }, { $set: storyPoints });
  },
  deleteAllEstimates: function() {
    Participants.update(
      {}, 
      { $set: { submittedEstimate: false } },
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
})
