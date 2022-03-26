"use strict";
//registers the slashcommands in ./commands folder to the discord server
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_json_1 = require("./config.json");
require("dotenv").config();
const token = process.env.BOT_TOKEN;
function default_1() {
    const commands = [];
    const commandFiles = fs_1.default
        .readdirSync(`${__dirname}/commands`)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    console.log("Registering Commands...");
    console.table(commands);
    const rest = new rest_1.REST({ version: "9" }).setToken(token);
    rest
        .put(v9_1.Routes.applicationCommands(config_json_1.clientId), { body: commands })
        .then(() => console.log("Successfully registered application commands."))
        .catch(console.error);
}
exports.default = default_1;
// require("dotenv").config();
// const { SlashCommandBuilder } = require("@discordjs/builders");
// const { REST } = require("@discordjs/rest");
// const { Routes } = require("discord-api-types/v9");
// const { clientId, guildId } = require("./config.json");
// const token = process.env.BOT_TOKEN;
// export default function () {
//   const rest = new REST({ version: "9" }).setToken(token);
//   rest
//     .get(Routes.applicationGuildCommands(clientId, guildId))
//     .then((data: any) => {
//       const promises = [];
//       for (const command of data) {
//         console.log(command);
//         if (command.name === "accept") {
//           const deleteUrl = `${Routes.applicationGuildCommands(
//             clientId,
//             guildId
//           )}/${command.id}`;
//           promises.push(rest.delete(deleteUrl));
//         }
//       }
//       return Promise.all(promises);
//     });
// }
