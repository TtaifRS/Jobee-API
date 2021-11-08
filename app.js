const express = require('express')
const dotenv = require('dotenv')

//setting up config.env file setup and initializing app
dotenv.config({ path: './config/config.env' })
const app = express()

const connectDatabase = require('./config/databse')
const errorMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler')

//importing routes 
const jobs = require('./routes/jobs')
const auth = require('./routes/auth')

//Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down due to uncaught exception.`)
    process.exit(1)
})



//database connection 
connectDatabase()

//express bodyparser 
app.use(express.json())

//route
app.use("/api/v1", jobs)
app.use('/api/v1', auth)

//handle unhandle routes 
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found!`, 404))
})

//middlewares
app.use(errorMiddleware)


const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

//handling unhandle promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to unhandle promise rejection.`)

    server.close(() => {
        process.exit(1)
    })
})

