const Post = require('../models/postModel');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(post, req.body, { updatedAt: Date.now() });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};*/
exports.updatePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      console.log('Post Author:', post.author.toString());
      console.log('User ID from Token:', req.user.id);
      console.log('User Role:', req.user.role);
  
      if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      Object.assign(post, req.body, { updatedAt: Date.now() });
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};