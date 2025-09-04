import express from 'express';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/category.controller.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get(`/`, getCategories);
router.post(`/`, upload.single("photo"), createCategory);
router.get(`/:category_id`, getCategory);
router.put(`/:category_id`, upload.single("photo"), updateCategory);
router.delete(`/:category_id`, deleteCategory);

export default router;
