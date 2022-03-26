"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modal = exports.buttons = exports.slash = void 0;
const discord_js_1 = require("discord.js");
const embedSender = (title, description, color, thumbnail, footer) => {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${title}`)
        .setDescription(`${description}`)
        .setColor(`#${color}`)
        .setThumbnail(`${thumbnail}`)
        .setFooter({ text: `${footer}` });
    return embed;
};
async function manual(client, interaction, orderID, emojiData) {
    const order = await require("../schemas/orderSchema").find({ orderID });
    if (!order[0]) {
        return await embedSender(`Order With This ID Not Found`, "Error 404: `The Entered Order ID Does Not Match Any Order In Our Records`", "ffcccb", "", "fail");
    }
    if (order[0].guildID == interaction.guild.id)
        return await embedSender(`You Cannot Deliver Your Own Order`, "Error 404: `The Entered Order ID Is From Your Server And Cannot Be Delivered`", "ffcccb", "", "fail");
    if (order[0].shopID != interaction.guild.id)
        return await embedSender(`You Cannot Deliver This Order`, "Error 404: `The Entered Order ID Is Not Meant For This Shop/Server`", "ffcccb", "", "fail");
    let guild = client.guilds.cache.get(order[0].guildID);
    if (!guild) {
        return await embedSender(`Order Delivery Location Not Found`, "Error: 404 `This Order Cannot Be Delivered`", "ffcccb", "", "fail");
    }
    let channel = await guild.channels.cache.get(order[0].channelID);
    if (!channel)
        return await embedSender(`Order Deliver Channel Not Found`, "This Order Cannot Be Delivered Since The Delivery Channel Is Not Found", "ffcccb", "", "fail");
    let invite = await channel.createInvite({
        maxUses: 1,
        maxAge: 60 * 60 * 12,
        temporary: true,
    });
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`Your Order For \`${order[0].item}\` Will Be Delivered Manually By ${interaction.user.username}`)
        .setColor("#FFF01F");
    await channel.send({
        content: `<@!${order[0].target}> `,
        embeds: [embed],
    });
    await require("../schemas/orderSchema").deleteOne({ orderID });
    return invite;
}
const automatic = async (client, interaction, orderID, embed, emojiData) => {
    const order = await require("../schemas/orderSchema").find({ orderID });
    if (!order[0])
        return;
    let guild = client.guilds.cache.get(order[0].guildID);
    if (!guild)
        return;
    let channel = await guild.channels.cache.get(order[0].channelID);
    if (!channel)
        return;
    const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
        .setCustomId("deliver_like")
        .setLabel("Like")
        .setStyle("PRIMARY"), new discord_js_1.MessageButton()
        .setCustomId("deliver_report")
        .setLabel("Report")
        .setStyle("DANGER"));
    await channel.send({
        content: `Here Is Your Order <@!${order[0].target}>`,
        embeds: [embed],
        components: [row],
    });
    await require("../schemas/orderSchema").deleteOne({ orderID });
    await require("../schemas/shopSchema").findOneAndUpdate({ guildID: order[0].shopID }, { $inc: { points: 200, orders: 1 } });
    await require("../schemas/profileSchema").findOneAndUpdate({ userID: interaction.user.id }, { $inc: { points: 200, total: 1 }, name: interaction.user.username }, { upsert: true, new: true });
};
const check = async (client, orderID, description, url, interaction, emojiData) => {
    const order = await require("../schemas/orderSchema").find({ orderID });
    if (!order[0])
        return await embedSender(`Order With This ID Not Found`, "Error 404: `The Entered Order ID Does Not Match Any Order In Our Records`", "ffcccb", "", "fail");
    if (order[0].guildID == interaction.guild.id)
        return await embedSender(`You Cannot Deliver Your Own Order`, "Error 404: `The Entered Order ID Is From Your Server And Cannot Be Delivered`", "ffcccb", "", "fail");
    if (order[0].shopID != interaction.guild.id)
        return await embedSender(`You Cannot Deliver This Order`, "Error 404: `The Entered Order ID Is Not Meant For This Shop/Server`", "ffcccb", "", "fail");
    let guild = client.guilds.cache.get(order[0].guildID);
    if (!guild)
        return await embedSender(`Order Delivery Location Not Found`, "Error: 404 `This Order Cannot Be Delivered`", "ffcccb", "", "fail");
    let channel = await guild.channels.cache.get(order[0].channelID);
    if (!channel)
        return await embedSender(`Order Deliver Channel Not Found`, "This Order Cannot Be Delivered Since The Delivery Channel Is Not Found", "ffcccb", "", "fail");
    let user = client.users.cache.get(order[0].target);
    let avatar;
    if (user)
        avatar = user.displayAvatarURL();
    else
        avatar = interaction.user.displayAvatarURL();
    let embed = new discord_js_1.MessageEmbed()
        .setTitle(`Your Order Is Here!!`)
        .setDescription(`Here Is Your Order \nMessage From Shop: \`\`\`${description}\`\`\` \nItem: \`${order[0].item}\` \nFullfilled By: \`${interaction.user.username}\` \n\n**If Your Are Satistifed By The Order Press The Heart Button**`)
        .setColor("#00FF7F")
        .setThumbnail(avatar)
        .setImage(`${url}`)
        .setFooter({ text: `${order[0].orderID} | ${order[0].shopID}` });
    return embed;
};
async function slash(client, interaction, emojiData) {
    let command = await interaction.options.getSubcommand();
    if (command == "manual") {
        let orderID = await interaction.options?.get("order_id")?.value;
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Generating Invite Link...")
            .setDescription("Please Wait While We Generate Your Delivery Link...")
            .setColor("#00ff00");
        await interaction.reply({ embeds: [embed] });
        let invite = await manual(client, interaction, orderID, emojiData);
        //@ts-ignore
        if (!invite.title)
            await interaction.editReply({
                content: `\`Please Deliver This Order Manually In This Server\` \n${invite}`,
                components: [],
                embeds: [],
            });
        else
            await interaction.editReply({
                components: [],
                embeds: [invite],
            });
    }
}
exports.slash = slash;
async function buttons(client, interaction, emojiData) {
    if (interaction.customId == "deliver_confirm") {
        await automatic(client, interaction, interaction.message.embeds[0].footer.text.split("|")[0].trim(), interaction.message.embeds[0], emojiData);
        await interaction.update({
            content: `${interaction.message.embeds[0].footer.text} Delevered By ${interaction.user.username} \n\`User Earned 200 Points\``,
            embeds: [],
            components: [],
        });
    }
    else if (interaction.customId == "deliver_cancel") {
        await interaction.update({
            content: `Delivery Canceled`,
            embeds: [],
            components: [],
        });
    }
    else if (interaction.customId == "deliver_report") {
        const webhook = new discord_js_1.WebhookClient({
            url: "https://discord.com/api/webhooks/942094823572262922/bsOLX5tfB6E4VNgTul7wzdWKH87_XckQRtZUQc5NOJfNHRW5GNaL-jk0931dwa8r9T7l",
        });
        webhook.send({
            content: `New Report By ${interaction.user.tag}`,
            embeds: [interaction.message.embeds[0]],
        });
        await interaction.update({ components: [], content: "Report Submitted" });
    }
    else if (interaction.customId == "deliver_like") {
        await require("../schemas/shopSchema").findOneAndUpdate({
            guildID: interaction.message.embeds[0].footer.text.split("|")[1].trim(),
        }, { $inc: { points: 200 } });
        interaction.update({ components: [] });
    }
    else if (interaction.customId == "deliver_manual") {
        let orderID = await interaction.message.embeds[0]?.footer?.text;
        const embed = new discord_js_1.MessageEmbed()
            .setTitle("Generating Invite Link...")
            .setDescription("Please Wait While We Generate Your Delivery Link...")
            .setColor("#00ff00");
        await interaction.reply({ embeds: [embed] });
        let invite = await manual(client, interaction, orderID, emojiData);
        //@ts-ignore
        if (!invite.title)
            await interaction.editReply({
                content: `\`Please Deliver This Order Manually In This Server\` \n${invite}`,
                components: [],
                embeds: [],
            });
        else
            await interaction.editReply({
                components: [],
                embeds: [invite],
            });
        await interaction.message.edit({ components: [] });
    }
}
exports.buttons = buttons;
async function modal(client, interaction, emojiData) {
    if (interaction.customId == "deliver-modal") {
        function validURL(str) {
            var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
            return !!pattern.test(str);
        }
        let orderID = interaction.getTextInputValue("deliver-id");
        let url = interaction.getTextInputValue("deliver-url");
        if (!url) {
            url =
                "https://images-ext-1.discordapp.net/external/rDnEyYvSwGqAVhU9Z7CNos3_zC3y8OtmUzxAmxSx5ls/https/cdn.discordapp.com/icons/868460642380709888/5549dad3210db304c164996a280b97e3.webp";
        }
        if (!validURL(url)) {
            return await interaction.reply({
                embeds: [
                    embedSender(`Invalid URL Provided`, `Please Provide A Valid URL`, "ffcccb", "", ""),
                ],
            });
        }
        let description = interaction.getTextInputValue("deliver-description");
        if (!orderID) {
            orderID = interaction.message?.embeds[0]?.footer?.text;
        }
        if (!description) {
            description = "Thanks For Ordering From Us";
        }
        let embed = await check(client, orderID, description, url, interaction, emojiData);
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("deliver_confirm")
            .setLabel("Confirm")
            .setEmoji(emojiData.tick)
            .setStyle("PRIMARY"), new discord_js_1.MessageButton()
            .setCustomId("deliver_cancel")
            .setLabel("Cancel")
            .setEmoji(emojiData.cross)
            .setStyle("SECONDARY"));
        if (embed.footer?.text == "fail")
            await interaction.reply({ embeds: [embed], components: [] });
        else
            await interaction.reply({ embeds: [embed], components: [row] });
    }
}
exports.modal = modal;
