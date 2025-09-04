const Blog = require('../models/Blog');
const blogsData = require('../data/blogs.json');

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
};

exports.seedBlogs = async (req, res) => {
  await Blog.deleteMany({});
  await Blog.insertMany(blogsData);
  res.json({ message: 'Blogs seeded' });
};
