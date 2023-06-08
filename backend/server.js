import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
const PORT = process.env.PORT || 3001

connectDB() // Connect to DB
const app = express()

app.get('/', (req, res) => {
    res.send("API is running...")
})

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})