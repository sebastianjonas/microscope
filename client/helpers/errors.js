/**
 * Created by sebastiankopf on 22.10.15.
 */

// Local (client-only) collection
Errors = new Mongo.Collection(null);
//MongoDB collection name set to null
//  (since this collection's data will
// never be saved into the server-side database):

throwError = function (message) {
    Errors.insert({message: message});
};

//The advantage of using a local collection to store the errors is that, like all collections, it's reactive -- meaning we can reactively display errors in the same way we display any other collection data.

Template.error.onRendered(function () {
    var error = this.data;
    //this.data lets us access the data of the object that is currently being rendered (in our case, an error).

    Meteor.setTimeout(function () {
        Errors.remove(error._id);
    }, 2700);
});

