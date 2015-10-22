Template.postsList.helpers({
    posts: function() {
        var postle = Posts.find();
        return postle;
    }
});