"use strict";
const mongoose = require("mongoose");
const mongoPath = "mongodb+srv://Hardcodex:rayyaan123@nekie.keklr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
module.exports = async () => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true, //dep fix
    });
    return mongoose;
};
