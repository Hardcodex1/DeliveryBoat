"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slash = void 0;
const discord_js_1 = require("discord.js");
async function slash(client, interaction, emojiData) {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`<a:shop:${emojiData.shop}> Commands!`)
        .setDescription(`\`\`\`This Bot Is Completely Slash Command Based!\`\`\``)
        .addFields({
        name: "/order official",
        value: "`Order From The Official Bot's Store. All Order's Delivered By Staff <3!`",
    }, {
        name: `/order market`,
        value: "`View A List Of Shops Where You Can Order From!`",
    }, {
        name: `/shop create/view/image/description`,
        value: "`Create And Customise Your Own Shop And Deliver Orders!`",
    }, {
        name: `/deliver manual`,
        value: "`Deliver A Particular Order Manually Using Order ID!`",
    }, {
        name: "/leaderboard server/user",
        value: "`View The Global Leaderboard For Different Shops And Users!`",
    }, {
        name: `/profile`,
        value: "`View Your Profiles!`",
    }, {
        name: "/delete profile/shop",
        value: "`Delete The Server Shop Or Your Data!`",
    })
        .setColor("#1cbced");
    return await interaction.reply({ embeds: [embed] });
}
exports.slash = slash;
