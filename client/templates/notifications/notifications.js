/**
 * Created by sebastiankopf on 27.10.15.
 */
Template.notifications.helpers({
    notifications: function() {
        var notifi1 = Notifications.find({userId: Meteor.userId(), read: false});
        return notifi1;
    },
    notificationCount: function(){
        var notifi2 = Notifications.find({userId: Meteor.userId(), read: false}).count();
        return notifi2;
    }
});

Template.notificationItem.helpers({
    notificationPostPath: function() {
        return Router.routes.postPage.path({_id: this.postId});
    }
});

Template.notificationItem.events({
    'click a': function() {
        Notifications.update(this._id, {$set: {read: true}});
    }
});
