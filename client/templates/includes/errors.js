/**
 * Created by sebastiankopf on 22.10.15.
 */
Template.errors.helpers({
   errors: function (){
       return Errors.find();
   }
});