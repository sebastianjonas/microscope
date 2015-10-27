Meteor.publish('posts', function () {
   var postsle = Posts.find();
   return postsle;
});

Meteor.publish('comments', function () {
    return Comments.find();
})