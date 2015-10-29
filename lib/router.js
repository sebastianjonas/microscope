/**
 * Created by sebastiankopf on 22.09.15.
 */
Router.configure({
    layoutTemplate: 'layout', //zeigt auf layout.html. ist das default Layout für alle Routen.
    // Wird verwendet wenn in einem Template {{>yield}} steht??
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        //Mit [] wird ein Array retuniered, ohne Klammer geht nur einer
        //return [Meteor.subscribe('posts'), Meteor.subscribe('comments')]
        return [Meteor.subscribe('notifications')];

    }

});


Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function () {
        return Posts.findOne(this.params._id);
    }
})

Router.route('/submit', {
    name: 'postSubmit'
});

Router.route('posts/:_id', {
    name: 'postPage',
    data: function () { //setzten den data kontext (das Objekt) im Template postPage
                        // wird sonst implizit durch die iteratoren im Template {{#each}} gemacht
                        //Alternativ auch durch {{#with ....}} im Template
        return Posts.findOne(this.params._id);
    },
    waitOn: function () {
        return Meteor.subscribe('comments', this.params._id);
    }
});
//:postsLimit? ist ein Parameter,das Fragezeichen kennzeichnet ihn als optional
//It's important to note that a path of the form /:parameter? will match every
// possible path. Since each route will be parsed successively to see if it matches
// the current path, we need to make sure we organize our routes in order of decreasing
// specificity.

//In other words, routes that target more specific routes like /posts/:_id should come first,
// and our postsList route should be moved to the bottom of the routes group since it pretty
// much matches everything,


Router.route('/:postsLimit?', {
    name: 'postsList',
    waitOn: function() {
        var limit = parseInt(this.params.postsLimit) || 5;
        return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
    },


    data: function() {
        var limit = parseInt(this.params.postsLimit) || 5;
        return {
            posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
        };
    }
});

var requireLogin = function () {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()){
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction('dataNotFound', {
    only: 'postPage'
    //zeigt notFound Template
});
Router.onBeforeAction(requireLogin, {
    only: 'postSubmit'
});




