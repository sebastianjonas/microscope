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
    waitOn: function () {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function () {
        return Posts.findOne(this.params._id);
    }
})

Router.route('/submit', {
    name: 'postSubmit'
});

Router.route('posts/:_id', {
    name: 'postPage',
    waitOn: function () {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('comments', this.params._id)
        ];
    },
    data: function () { //setzten den data kontext (das Objekt) im Template postPage
                        // wird sonst implizit durch die iteratoren im Template {{#each}} gemacht
                        //Alternativ auch durch {{#with ....}} im Template
        return Posts.findOne(this.params._id);
    }

});


// PostListController wird automatisch von der Route postList verwendet
PostsListController = RouteController.extend({
   template: 'postsList', 
    increment: 5,
    postsLimit: function () {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function () {
      return {sort: {submitted: -1}, limit: this.postsLimit()};
    },

    subscriptions: function () {
        this.postsSub = Meteor.subscribe('posts', this.findOptions());
    },

/*    waitOn: function () {
        return Meteor.subscribe('posts', this.findOptions());
    },
    entfernt weil damit immer Loadingtemplate kommt,
    subscriptions eingefügt */
    posts: function () {
        return Posts.find({}, this.findOptions());
    },
    data: function () {

        //setzt die neue URL zusammen wenn mehr verfügbar
        var hasMore = this.posts().count() === this.postsLimit();
        var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});

        return {
            /*We're taking that path and adding it to the data context for our template,
            but only if there are more posts to display. The way we do that is a bit tricky.
             */
            posts: this.posts(),
            ready: this.postsSub.ready,
            /*On the other hand, this.posts refers to the current cursor, so this.posts.count()
             refers to the number of posts that are actually in the cursor.
              */
             nextPath: hasMore ? nextPath : null
        };
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
/*    waitOn: function() {

        //wenn in der url eine Zahl mitgegeben wird (http://localhost:3000/3) dan wird der
        // ausgewertet und als limit übergeben
        // wenn der leer ist dann gibts den 5-er (|| --> ODER
        var limit = parseInt(this.params.postsLimit) || 5;
        return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
    },


    data: function() {
        var limit = parseInt(this.params.postsLimit) || 5;
        return {
            posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
        };
    }*/
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




