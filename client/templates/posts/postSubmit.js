/**
 * Created by sebastiankopf on 22.10.15.
 */
Template.postSubmit.events({
   'submit form': function(event){
       event.preventDefault();

       var post = {
         url: $(event.target).find('[name=url]').val(),
           title: $(event.target).find('[name=title]').val()
       };

       //post._id = Posts.insert(post);
      // Router.go('postPage', post);
       /*
       Finally, we can route to our new post's pag
       e. The insert() function on a collection returns
        the generated _id for the object that has be
        en inserted into the database, which the Router's go()
         function will use to construct a URL for us to browse to.
        */

       Meteor.call('postInsert', post, function (error, result) {
           //display the error to the user and abort
           if (error) {
               return alert (error.reason);

           } if (result.postExists){
               alert('This link has already been posted');
           } /*else {
               Router.go('postPage', {_id: result._id});
           }*/
       });
       Router.go('postsList');

   }
});


