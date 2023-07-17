import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 3001

connectDB() // Connect to DB
const app = express()

// Parser Middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => 
    res.send({clientId: process.env.PAYPAL_CLIENT_ID})
)

const __dirname = path.resolve() //Set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    // Set frontend/build as static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    // Serve index.html if any route is hit
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send("API is running...")
    })
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})