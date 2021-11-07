const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_LOCAL_URI)
        .then(con => {
            console.log(`Database connected with host: ${con.connection.host}`)
        })
        .catch(err => console.log(err))
}

module.exports = connectDatabase