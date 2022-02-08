import PostsModel from '@models/posts.model';

/**
 * @description Render all posts page
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getAllPosts = async (req, res) => {
  const posts = await PostsModel.find().lean();
  res.render('admin/posts/posts', {
    posts,
    pathName: 'posts',
  });
};

/**
 * @description Render create post page
 *
 * @param {object} req
 * @param {object} res
 */
export const getCreateNewPost = (req, res) => {
  res.render('admin/posts/edit-post');
};

/**
 * @description Create new post
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
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

/**
 * @description Render edit post page
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const getEditPost = async (req, res) => {
  const postId = req.params.postId;
  const post = await PostsModel.findById(postId).lean();
  res.render('admin/posts/edit-post', {
    post,
    edit: true,
  });
};

/**
 * @description Update post
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const postUpdatePost = async (req, res) => {
  const postId = req.params.postId;
  const post = await PostsModel.findById(postId);
  post.title = req.body.title;
  post.content = req.body.content;
  await post.save();
  res.redirect('/admin/posts');
};

/**
 * @description Delete post
 *
 * @param {object} req
 * @param {object} res
 * @returns {Promise}
 */
export const postDeletePost = async (req, res) => {
  const postId = req.body.postId;
  await PostsModel.findByIdAndDelete(postId);
  res.redirect('/admin/posts');
};
