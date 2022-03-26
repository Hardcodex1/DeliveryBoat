"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slash = void 0;
const discord_js_1 = require("discord.js");
async function slash(client, interaction, emojiData) {
    const profileSchema = require("../schemas/profileSchema");
    let userID = await interaction.options?.get("user")?.value;
    if (!userID)
        userID = interaction.user.id;
    const profile = await profileSchema.find({ userID });
    if (!profile[0]) {
        if (await interaction.options?.get("user")?.value)
            return await interaction.reply({
                content: `The User Entered Does Not Have A Profile!`,
                ephemeral: true,
            });
        else
            return await interaction.reply({
                content: `You don't have a profile yet! Start Deliveing/Ordeing Stuff To Create One!`,
                ephemeral: true,
            });
    }
    const member = interaction.guild.members.cache.get(userID);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${member.user.username}'s Profile`)
        .setDescription(`Name: \`${member.user.username}\` \nPoints: \`${profile[0]?.points ? profile[0].points : 0}\` \nDeliveries: \`${profile[0]?.total ? profile[0].total : 0}\` \nOrders: \`${profile[0]?.orders ? profile[0]?.orders : 0}\``)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor("#00ff00");
    await interaction.reply({ embeds: [embed] });
}
exports.slash = slash;
