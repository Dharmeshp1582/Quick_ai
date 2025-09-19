import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import morgan from 'morgan';
import connectDB from './configs/connection.database.js';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/ai.route.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/user.route.js';

const app = express()

await connectCloudinary()

await connectDB()
const PORT = process.env.PORT || 8080

app.use(morgan('dev'))

app.use(cors({
  origin:'http://localhost:5173',
  credentials: true}
))
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('Hello from server')
})

app.use(requireAuth())

app.use('/api/ai', aiRouter )
app.use('/api/user', userRouter )

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))