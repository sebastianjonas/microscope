/**
 * Created by sebastiankopf on 27.10.15.
 */
Template.commentSubmit.onCreated(function () {
    Session.set('commentSubmitErrors',{});
});

Template.commentSubmit.helpers({
    errorMessage: function(field){
        return Session.get('commentSubmitErrors')[field];
    },
    errorClass: function (field) {
        return Session.get('commentSubmitErrors')[field]?'has-error' : '';
    }
});

Template.commentSubmit.events({
   'submit form': function (event, template){
       event.preventDefault();

       var $body = $(event.target).find('[name=body]').val();
       var postId =  template.data_id

       var comment = {
           body: $body,
           postId: postId
       };

       var errors = {};
       if (!comment.body){
           errors.body = "Please write some content";
           return Session.set('commentSubmitErrors', errors);
       }
       Meteor.call('commentInsert', comment, function (error, commentId) {
           if (error){
               throwError(error.reason);
           } else {
               $body.val('');
           }
       })
   }
});