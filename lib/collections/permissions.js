/**
 * Created by sebastiankopf on 22.10.15.
 */

// check that the userId specified owns the documents
ownsDocument= function (userId, doc) {
    return doc && doc.userId === userId;
    //nehme an das ist eine if abfrage
}