"use strict";
const mongoose = require("mongoose");
const mongoPath = "";
module.exports = async () => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true, //dep fix
    });
    return mongoose;
};
