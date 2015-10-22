Template.postsList.helpers({
    posts: function() {
        var postle = Posts.find({}, {sort: {submitted: -1}});
        return postle;
    }
});