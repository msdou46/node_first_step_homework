const mongoose = require("mongoose")

const connect = () => {
    mongoose
        .connect("mongodb://localhost:27017/notion")
        .catch(error => console.log("connet err ", error))
};

mongoose.connection.on("error", error => {
    console.error("connection err ", error)
})

module.exports = connect;