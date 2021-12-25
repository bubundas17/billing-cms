import PostsModel from '../../models/posts.model';


// get request: get all posts
export const getAllPosts = async (req, res) => {
    const posts = await PostsModel.find();
    res.render('admin/posts/posts', {
        pathName: 'posts',
        posts: posts
    });
}

// post request: add new post
export const addPost = async (req, res) => {
    res.render('admin/posts/add-post', {
        pathName: 'add-post'
    });
}

// get request: edit post
export const editPost = async (req, res) => {
    const postId = req.params.postId;
    const post = await PostsModel.findById(postId);
    res.render('admin/posts/edit-post', {
        pathName: 'edit-post',
        post: post
    });
}

// post request: update post
export const updatePost = async (req, res) => {
    const postId = req.params.postId;
    const post = await PostsModel.findById(postId);
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.redirect('/admin/posts/edit-post/' + postId);
}