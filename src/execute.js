"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const bot_1 = require("./bot");
const emoji_1 = __importDefault(require("./emoji"));
module.exports = async function () {
    const emojiData = await (0, emoji_1.default)(bot_1.client);
    bot_1.client.on("modalSubmit", async (modal) => {
        const command = await require(`../exports/${modal.customId.split("-")[0]}`);
        command.modal(bot_1.client, modal, emojiData);
    });
    bot_1.client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            const command = await require(`../exports/${interaction.commandName}`);
            command.slash(bot_1.client, interaction, emojiData);
        }
        else if (interaction.isButton()) {
            const command = await require(`../exports/${interaction.customId.split("_")[0]}`);
            command.buttons(bot_1.client, interaction, emojiData);
        }
    });
};
