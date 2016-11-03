var Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
  Meteor.subscribe("resolutions");
  
  Template.body.helpers({
    // Array
    /*resolutions: [
      { title: "Hello resolution #1" },
      { title: "Hello resolution #2" },
      { title: "Hello resolution #3" }
    ]*/
    // function
    resolutions: function () {
      // accessing database
      // Can add through the console with command : db.resolutions.insert({ title: "My title here", createdAt: new Date() });
      if (Session.get('hideFinished')) {
        return Resolutions.find({checked: {$ne: true}});
      }
      else {
        return Resolutions.find();
      }
    },
      
    hideFinished: function () {
      return Session.get('hideFinished');
    }
  });
  
  Template.body.events({
    'change .hide-finished': function (event) {
      Session.set('hideFinished', event.target.checked);
    },
    
    'submit .new-resolution': function (event) {
      var title = event.target.title.value;
      
      Meteor.call("addResolution", title);
      
      event.target.title.value = '';
      
      return false;
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
  
  Meteor.publish("resolutions", function () {
    return Resolutions.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

Meteor.methods({
  addResolution: function (title) {
    Resolutions.insert({
      title : title,
      createdAt : new Date(),
      owner: Meteor.userId()
    });
  },
  
  updateResolution: function (id, checked) {
    var res = Resolutions.findOne(id);

    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, { $set: {checked: checked} });
  },
  
  deleteResolution: function (id) {
    var res = Resolutions.findOne(id);

    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.remove(id);
  },
  
  setPrivate: function (id, private) {
    var res = Resolutions.findOne(id);
    
    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    Resolutions.update(id, { $set: {private: private} });
  }
});