Template.postItem.helpers({
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    ownPost: function(){
      return this.userId === Meteor.userId();
    },

    upvotedClass: function(){
     var userID = Meteor.userId();
        if (userID && !_.include(this.upvoters, userID)) {
            return 'butn-primary upvotable';
        } else {
            return 'disabled';
        }
    }

    //CommentsCount wurde zuerst über CommentCollection ermittelt
    //jetzt wird es bei jedem CommentInsert direkt auf der Posts Collection
    //erweitert.
    //Damit mapped Meteor nicht mehr auf den Helper, sondern auf das Attribut
    // der aktuelle im Datakontext verfügbaren Collection (nach welcher Prio?).
    /*
    commentsCount: function(){
        return Comments.find({postId: this._id}).count();
    }
    */


});

Template.postItem.events({
   'click .upvoteable': function (event) {
       event.preventDefault();
       Meteor.call('upvote', this._id);
   }
});