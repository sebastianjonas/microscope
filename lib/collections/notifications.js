/**
 * Created by sebastiankopf on 27.10.15.
 */
Notifications = new Mongo.Collection('notifications');

Notifications.allow({
   update: function(userId, doc, fieldnames) {
       //Prüft ob eigenes Doc, nur ein attribut, und ob dieses eine das "read" attributeist
       return ownsDocument(userId, doc) && fieldnames.length === 1 && fieldnames[0] === 'read';
   }
});

createCommentNotification = function(comment){
  var post = Posts.findOne(comment.postId);
    if(comment.userId !== post.userId){
        var notifica = {
          userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        };

        //comment._id = Comments.insert(comment);

        var notificationid=  Notifications.insert(notifica);
        console.log(notificationid);
    }
};