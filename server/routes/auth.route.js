import express from 'express';
import {getUsers, login, register, updateUserRole} from '../controllers/auth.controller.js';

const router = express.Router();

router.post(`/register`, register);
router.post(`/login`, login);
router.get(`/users`, getUsers);
router.put(`/update-user-role`, updateUserRole);


export default router;