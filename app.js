const express = require('express')
const dotenv = require('dotenv')

//importing routes 
const jobs = require('./routes/jobs')

const app = express()

//setting up config.env file setup 
dotenv.config({ path: './config/config.env' })

app.use("/api/v1", jobs)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})