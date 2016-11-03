if (Meteor.isClient) {
    Template.resolution.events({
        'click .delete': function () {
            Meteor.call("deleteResolution", this._id);
        },
        
        'click .toggle-checked': function () {
            Meteor.call("updateResolution", this._id, !this.checked);
        },
        
        'click .toggle-private': function () {
            Meteor.call("setPrivate", this._id, !this.private);
        }
    });
    
    Template.resolution.helpers({
        isOwner: function () {
            return this.owner === Meteor.userId();
        }
    });
}