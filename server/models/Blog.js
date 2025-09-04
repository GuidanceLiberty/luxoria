const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  id: Number,
  img: String,
  title: String,
  desc: String,
  date: String
});

module.exports = mongoose.model('Blog', blogSchema);
