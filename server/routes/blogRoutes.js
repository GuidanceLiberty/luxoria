const express = require('express');
const router = express.Router();
const { getBlogs, seedBlogs } = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/seed', seedBlogs);

module.exports = router;
