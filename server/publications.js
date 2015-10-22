Meteor.publish('posts', function () {
   var postsle = Posts.find();
   return postsle;
});