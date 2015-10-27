/**
 * Created by sebastiankopf on 27.10.15.
 */
Template.postPage.helpers({
    comments: function(){
        return Comments.find({postId: this._id});
    }
})