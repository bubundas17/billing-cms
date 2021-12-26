import PostsModel from '../../models/posts.model';

// get request: get all posts
export const getAllPosts = async (req, res) => {
    const posts = await PostsModel.find().lean();
    res.render('admin/posts/posts', {
        posts: posts,
    });
};

// get request: get new post form
export const getNewPost = (req, res) => {
    res.render('admin/posts/single-post');
};

// post request: add new post
export const addPost = async (req, res) => {
    const { title,
        body,
        slug,
        status } = req.body;
    const newPost = new PostsModel({
        title,
        body,
        slug,
        status
    });
    await newPost.save();
    res.redirect('/admin/posts/' + newPost._id);
};

// get request: edit post
export const editPost = async (req, res) => {
    const postId = req.params.postId;
    const post = await PostsModel.findById(postId).lean();
    console.log(post);
    res.render('admin/posts/single-post', {
        post: post,
    });
};

// post request: update post
export const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const post = await PostsModel.findById(postId);
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.redirect('/admin/posts/edit-post/' + postId);
};
