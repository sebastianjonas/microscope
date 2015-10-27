/**
 * Created by sebastiankopf on 22.09.15.
 */
Router.configure({
    layoutTemplate: 'layout', //zeigt auf layout.html. ist das default Layout für alle Routen.
    // Wird verwendet wenn in einem Template {{>yield}} steht??
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        return [Meteor.subscribe('posts'), Meteor.subscribe('comments')]

    }

});

Router.route('/', {
    name: 'postsList'
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

