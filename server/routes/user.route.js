import express from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import { getPublishedCreations, getUserCreations, toggleLikeCreations } from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/get-user-creations',auth, getUserCreations)
userRouter.get('/get-publish-creations',auth, getPublishedCreations)
userRouter.post('/toggle-like-creation',auth, toggleLikeCreations)

export default userRouter