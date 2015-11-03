/**
 * Created by sebastiankopf on 03.11.15.
 */
Template.registerHelper('pluralize', function (n, thing) {
    // fairly stupid pluralizer
    if (n === 1){
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }

})