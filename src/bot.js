"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const { Client, Intents } = require("discord.js");
require("dotenv").config();
const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
});
exports.client = client;
client.login(process.env.BOT_TOKEN);
