// Session.setDefault('counter', 0);
import '../imports/main.js';

Meteor.subscribe('participants.public');

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
  },
  isChecked: function(value) {
    return value;
  }
});

Template.participantForm.events({
  "reset .estimate": function(event, template) {
    event.currentTarget.reset();
  },
  "submit .estimate": function (event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    let input = {
      zero: template.$('.point0').is(':checked'),
      one: template.$('.point1').is(':checked'),
      two: template.$('.point2').is(':checked'),
      three: template.$('.point3').is(':checked'),
      five: template.$('.point5').is(':checked'),
      eight: template.$('.point8').is(':checked'),
      thirteen: template.$('.point13').is(':checked'),
      inf: template.$('.pointInf').is(':checked'),
      na: template.$('.pointNa').is(':checked'),
    };

    // Insert a task into the collection
    Meteor.call("submitEstimate", input);
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

