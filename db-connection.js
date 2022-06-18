const mongoose = require("mongoose");


const db = mongoose.connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log("User mongodb connected");
    })
  .catch(e => console.log(e));

module.exports = db;