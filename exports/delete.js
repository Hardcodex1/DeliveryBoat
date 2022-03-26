"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slash = void 0;
const discord_js_1 = require("discord.js");
async function slash(client, interaction, emojiData) {
    let command = await interaction.options.getSubcommand();
    if (command == "profile") {
        const profileSchema = require("../schemas/profileSchema");
        await profileSchema.deleteOne({ userID: interaction.user.id });
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`<a:tick:${emojiData.tick}> Profile Deleted!`)
            .setDescription(`Your Profile And All Your Data Has Been Erased From Our Database`)
            .setColor("#00ff00")
            .setThumbnail("https://cdn.discordapp.com/attachments/882894520126152735/957212043134533662/wastebasket_1f5d1-fe0f.png");
        await interaction.reply({ embeds: [embed] });
    }
    else if (command == "shop") {
        if (!interaction.member.permissions.has("ADMINISTRATOR") &&
            !interaction.member.permissions.has("MANAGE_GUILD"))
            return await interaction.reply({
                content: "You Need Manage Server Permission To Run This Command",
                ephemeral: true,
            });
        const shopSchema = require("../schemas/shopSchema");
        await shopSchema.deleteOne({ guildID: interaction.guild.id });
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(`<a:tick:${emojiData.tick}> Shop Deleted!`)
            .setDescription(`All Shop Data From This Server Has Been Deleted!`)
            .setColor("#00ff00")
            .setThumbnail("https://cdn.discordapp.com/attachments/882894520126152735/957212043134533662/wastebasket_1f5d1-fe0f.png");
        await interaction.reply({ embeds: [embed] });
    }
}
exports.slash = slash;
