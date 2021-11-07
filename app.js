const express = require('express')
const dotenv = require('dotenv')

const app = express()

//setting up config.env file setup 
dotenv.config({ path: './config/config.env' })


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})