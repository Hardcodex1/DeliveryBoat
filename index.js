"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./src/bot");
const execute_1 = __importDefault(require("./src/execute"));
const mongo_1 = __importDefault(require("./src/mongo"));
const discord_modals_1 = __importDefault(require("discord-modals"));
(0, discord_modals_1.default)(bot_1.client);
const register_1 = __importDefault(require("./register"));
(0, register_1.default)();
process
    .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
})
    .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
});
bot_1.client.on("ready", async () => {
    console.log("Bot Online Proceed To Discord!");
    await (0, mongo_1.default)();
    (0, execute_1.default)();
    let users = 0;
    bot_1.client.guilds.cache.forEach((guild) => {
        users = users + guild.memberCount;
    });
    bot_1.client.user.setPresence({
        activities: [
            {
                name: `Delevering In ${bot_1.client.guilds.cache.size} Servers For ${users} Users`,
                type: "LISTENING",
            },
        ],
        status: "dnd",
    });
});
