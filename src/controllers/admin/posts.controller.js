import PostsModel from '../../models/posts.model';

// get request: get all posts
export const getAllPosts = async (_req, res) => {
  const posts = await PostsModel.find().lean();
  res.render('admin/posts/posts', {
    posts,
    pathName: 'posts',
  });
};

// get request: get new post form
export const getCreateNewPost = (req, res) => {
  res.render('admin/posts/edit-post');
};

// post request: add new post
export const postCreateNewPost = async (req, res) => {
  const { title, body, slug, status } = req.body;
  const newPost = new PostsModel({
    title,
    body,
    slug,
    status,
  });
  await newPost.save();
  res.redirect('/admin/posts');
};

// get request: edit post
export const getEditPost = async (req, res) => {
  const postId = req.params.postId;
  const post = await PostsModel.findById(postId).lean();
  res.render('admin/posts/edit-post', {
    post,
    edit: true,
  });
};

// post request: update post
export const postUpdatePost = async (req, res) => {
  const postId = req.params.postId;
  const post = await PostsModel.findById(postId);
  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.redirect('/admin/posts');
};

export const postDeletePost = async (req, res) => {
  const postId = req.body.postId;
  await PostsModel.findByIdAndDelete(postId);
  res.redirect('/admin/posts');
};
