Meteor.publish('posts', function () {
   var postsle = Posts.find();
   return postsle;
});

Meteor.publish('comments', function(postId) {
    check(postId, String);
    return Comments.find({postId: postId});
});

Meteor.publish('notifications', function () {
    return Notifications.find();
})

