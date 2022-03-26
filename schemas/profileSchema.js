"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const swipeSchema = new mongoose_1.default.Schema({
    userID: String,
    points: Number,
    joined: Date,
    total: Number,
    orders: Number,
    name: String,
});
module.exports = mongoose_1.default.model("profile", swipeSchema);
