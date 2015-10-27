/**
 * Created by sebastiankopf on 27.10.15.
 */
Template.notifications.helpers({
    notifications: function() {
       var notifi1 = Notifications.find({userId: Meteor.userId(), read: false});
        return notifi
    },
    notificationCount: function(){
        var notifi2 = Notifications.find({userId: Meteor.userId(), read: false}).count();
        return notifi
    }
});

Template.notificationItem.helpers({
   notificationPostPath: function (){
       var notifi3 =  Router.routes.postPage.path({_id: this._id});
       return notifi3
   }
});

Template.notificationItem.events({
    'click a': function () {
        Notifications.update(this._id, {$set: {read: true}});
    }
})
