/**
 * Created by sebastiankopf on 22.09.15.
 */
Posts = new Mongo.Collection('posts');

validatePost = function (post) {
    var errors = {};
    if (!post.title){ //
        errors.title = "Please fill in a headline";
    }
    if (!post.url){
        errors.url = "Please fill in a URL";
    }
    return errors;
}

Posts.allow({
    insert: function(userId, doc) {
        // only allow posting if you are logged in
        // ist nur am client relevant. server methoden berücksichten das nicht
        return !! userId;
    },
    update: function(userId, post) {
        return ownsDocument(userId, post);
    },
    remove: function(userId, post){
        return ownsDocument(userId, post);

    }
});

Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        // may only edit the following two fields:
        var errors = validatePost(modifier.$set);
        return errors.title || errors.url;

//        return (_.without(fieldNames, 'url', 'title').length > 0);
        //Damit werden alle updates verweigert deren Feldnamen
        // nicht url oder title sind.
    }
});

Meteor.methods({
   postInsert: function(postAttributes){
       check(Meteor.userId(), String);
       check(postAttributes, {
           title: String,
           url: String
       });

       var errors = validatePost(postAttributes);
       if (errors.title || errors.url){
           throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");
       }

       /* if (Meteor.isServer){
           postAttributes.title +="server";
           //wait for 5 Seconds
           Meteor._sleepForMs(5000);
       } else {
           postAttributes.title += "client";
       }
       */
       //duplikate finden mit gleicher URL
       var postWithSameLink = Posts.findOne({url: postAttributes.url});
       if (postWithSameLink) {
           return {
               postExists: true,
               _id: postWithSameLink._id
           }
       }


       var user = Meteor.user();
       var post = _.extend(postAttributes, {
           /* Note that the _.extend() method is part of the
            Underscore library, and simply lets you “extend”
             one object with the properties of another.
             */
           userId: user._id,
           author: user.username,
           submitted: new Date(),
           commentsCount: 0,
           upvoters: [],
           votes: 0
       });
       var postId = Posts.insert(post);
       return {
           _id: postId
       };
   },

    upvote: function (postId) {
        check(this.userId, String);
        check(postId, String);
        var post = Posts.findOne(postId);
        if(!post){
            throw new Meteor.Error('invalid', 'Post not found');
        }
        if(_.include(post.upvoters, this.userId)){
            throw new Meteor.Error('invalid', 'Already upvoted this post');
        } else {
            Posts.update(post._id, {

                /*: $addToSet adds an item to an array property as long as it doesn't
                 already exist,
                  and $inc simply increments an integer field.
                 */
                $addToSet: {upvoters: this.userId},
                $inc: {votes: 1}
            });
        }

    }
});