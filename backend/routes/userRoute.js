import express from 'express';
import {getUser,updateUser, changePassword,registerUser,loginUser } from '../controllers/userController.js';

import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();  

//PUBLIC LINKS

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


//PRIVATE LINKS protect also
userRouter.get('/me', authMiddleware ,getUser);
userRouter.put('/update', authMiddleware,updateUser);
userRouter.put('/password', authMiddleware,changePassword);

export default userRouter;