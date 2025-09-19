import express from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import { getPublishedCreations, getUserCreations, toggleLikeCreations } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/get-user-creation',auth, getUserCreations)
userRouter.get('/get-publish-creation',auth, getPublishedCreations)
userRouter.post('/get-like-creation',auth, toggleLikeCreations)

export default userRouter