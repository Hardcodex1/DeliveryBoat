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
                content: `<a:cross:${emojiData.cross}> The User Entered Does Not Have A Profile!`,
                ephemeral: true,
            });
        else
            return await interaction.reply({
                content: `<a:cross:${emojiData.cross}> You don't have a profile yet! Start Deliveing/Ordeing Stuff To Create One!`,
                ephemeral: true,
            });
    }
    const member = interaction.guild.members.cache.get(userID);
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`<a:tick:${emojiData.tick}> ${member.user.username}'s Profile`)
        .setDescription(`<:age:${emojiData.age}> Name: \`${member.user.username}\` \n<a:upvote:${emojiData.upvote}> Points: \`${profile[0]?.points ? profile[0].points : 0}\` \n<:deliver:${emojiData.deliver}>Deliveries: \`${profile[0]?.total ? profile[0].total : 0}\` \n<:order:${emojiData.order}> Orders: \`${profile[0]?.orders ? profile[0]?.orders : 0}\``)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor("#00ff00");
    await interaction.reply({ embeds: [embed] });
}
exports.slash = slash;
