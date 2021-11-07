const express = require('express')
const dotenv = require('dotenv')

//setting up config.env file setup 
dotenv.config({ path: './config/config.env' })

const connectDatabase = require('./config/databse')

//importing routes 
const jobs = require('./routes/jobs')

const app = express()



//database connection 
connectDatabase()

//express bodyparser 
app.use(express.json())

app.use("/api/v1", jobs)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})