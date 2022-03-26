"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const shopSchema = new mongoose_1.default.Schema({
    guildID: String,
    name: String,
    channelID: String,
    image: String,
    description: String,
    orders: Number,
    points: Number,
});
module.exports = mongoose_1.default.model("shops", shopSchema);
