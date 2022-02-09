import { Request, Response } from 'express';

import PostsModel from '@models/posts.model';

// Render all posts page
export const getAllPosts = async (_req: Request, res: Response) => {
  const posts = await PostsModel.find().lean();
  res.render('admin/posts/posts', {
    posts,
    pathName: 'posts',
  });
};

// Render create post page
export const getCreateNewPost = (_req: Request, res: Response) => {
  res.render('admin/posts/edit-post');
};

// Create new post
export const postCreateNewPost = async (req: Request, res: Response) => {
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

// Render edit post page
export const getEditPost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = await PostsModel.findById(postId).lean();
  res.render('admin/posts/edit-post', {
    post,
    edit: true,
  });
};

// Update post
export const postUpdatePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const post = await PostsModel.findById(postId);
  post.title = req.body.title;
  await post.save();
  res.redirect('/admin/posts');
};

// Delete post
export const postDeletePost = async (req: Request, res: Response) => {
  const postId = req.body.postId;
  await PostsModel.findByIdAndDelete(postId);
  res.redirect('/admin/posts');
};
