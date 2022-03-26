"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const swipeSchema = new mongoose_1.default.Schema({
    orderID: String,
    item: String,
    guildID: String,
    shopID: String,
    channelID: String,
    target: String,
    createdAt: { type: Date, expires: 60 * 60 * 24, default: Date.now },
});
module.exports = mongoose_1.default.model("orders", swipeSchema);
