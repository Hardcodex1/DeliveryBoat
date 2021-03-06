"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slash = void 0;
const discord_js_1 = require("discord.js");
const userBoard = async (interaction, emojiData) => {
    let data = await require("../schemas/profileSchema").find({
        guildID: interaction.guild.id,
    });
    if (!data[0])
        return new discord_js_1.MessageEmbed().setTitle("No data");
    if (data.length == 1) {
        let text = `${data[0].name} - ${data[0].points} - ${data[0].total}`;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle(`User Leaderboard For This Server`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setColor("#0099ff");
        return new discord_js_1.MessageEmbed().setTitle("No data for this server");
    }
    let text = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - 1; j++) {
            if (data[j].points < data[j + 1].points) {
                let temp = data[j];
                data[j] = data[j + 1];
                data[j + 1] = temp;
            }
        }
        text = text + `${data[i].name} - ${data[i].points} - ${data[i].total}\n`;
    }
    let embed = new discord_js_1.MessageEmbed()
        .setTitle(`User Leaderboard For This Server`)
        .setDescription(`\`\`\`${text}\`\`\``)
        .setColor("#0099ff");
    return new discord_js_1.MessageEmbed().setTitle("No data for this server");
};
const serverBoard = async (emojiData) => {
    let data = await require("../schemas/shopSchema").find();
    if (!data[0])
        return;
    if (data.length == 1) {
        let text = `${data[0].name} - ${data[0].points}`;
        let embed = new discord_js_1.MessageEmbed()
            .setTitle(`Server Leaderboard`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setColor("#0099ff");
        return embed;
    }
    let text = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - 1; j++) {
            if (data[j].points < data[j + 1].points) {
                let temp = data[j];
                data[j] = data[j + 1];
                data[j + 1] = temp;
            }
        }
        text = text + `${data[i].name} - ${data[i].points}\n`;
    }
    let embed = new discord_js_1.MessageEmbed()
        .setTitle(`Server Leaderboard`)
        .setDescription(`\`\`\`${text}\`\`\``)
        .setColor("#0099ff");
    return embed;
};
async function slash(client, interaction, emojiData) {
    let command = await interaction.options.getSubcommand();
    if (command == "server") {
        let embed = await serverBoard(emojiData);
        await interaction.reply({ embeds: [embed] });
    }
    else if (command == "user") {
        let embed = await userBoard(interaction, emojiData);
        await interaction.reply({ embeds: [embed] });
    }
}
exports.slash = slash;
