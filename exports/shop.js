"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slash = void 0;
const discord_js_1 = require("discord.js");
const embedSender = (title, description, color, thumbnail) => {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${title}`)
        .setDescription(`${description}`)
        .setColor(`#${color}`)
        .setThumbnail(`${thumbnail}`);
    return embed;
};
const view = async (name, interaction, emojiData) => {
    let shopData;
    const shopSchema = require("../schemas/shopSchema");
    if (name != "me") {
        shopData = await shopSchema.find({ name });
    }
    else {
        shopData = await shopSchema.find({ guildID: interaction.guild.id });
    }
    if (!shopData[0]) {
        let errorEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`Shop Not Found!`)
            .setDescription(`The shop you are looking for does not exist or you don't have a shop`);
        return errorEmbed;
    }
    let embed = new discord_js_1.MessageEmbed()
        .setTitle(`Shop Of ${interaction.guild.name}`)
        .setDescription(`Name: \`${shopData[0].name}\` \nDescription: \`${shopData[0].description
        ? shopData[0].description
        : "Welcome To Our Shop. Please Order"}\` \nPoints: \`${shopData[0].points ? shopData[0].points : 0}\``)
        .setThumbnail(shopData[0].image)
        .setColor("#00000");
    return embed;
};
const create = async (name, channel, interaction, emojiData) => {
    const shopSchema = require("../schemas/shopSchema");
    const data = shopSchema.find({ guildID: interaction.guild.id });
    await shopSchema.findOneAndUpdate({ guildID: interaction.guild.id }, {
        guildID: interaction.guild.id,
        name,
        channelID: channel,
        image: data[0] ? data[0].image : interaction.guild.iconURL(),
        description: data[0]
            ? data[0].description
            : "Welcome To My Shop. Please Order",
    }, { upsert: true, new: true });
    let embed = new discord_js_1.MessageEmbed()
        .setTitle(`Shop Created/Updated!`)
        .setDescription(`Name: \`${name}\` \nDescription: \`${data[0]?.description
        ? data[0]?.description
        : "Welcome To My Shop. Please Order"}\``)
        .setColor("#0099ff")
        .setThumbnail(data[0]?.image ? data[0]?.image : interaction.guild.iconURL());
    return embed;
};
const image = async (URL, interaction, emojiData) => {
    const shopSchema = require("../schemas/shopSchema");
    const data = await shopSchema.find({ guildID: interaction.guild.id });
    if (!data[0])
        return await embedSender(`Shop Not Found!`, "This Server Does Not Have An Active Shop. \nUse `/shop create` to make one", "ffcccb", interaction.guild.iconURL());
    await shopSchema.findOneAndUpdate({ guildID: interaction.guild.id }, { image: URL });
    return await embedSender(`Shop Image Updated!`, "Your Server Shop Image Has Been Updated", "39FF14", URL);
};
const description = async (descriptionString, interaction, emojiData) => {
    const shopSchema = require("../schemas/shopSchema");
    const data = await shopSchema.find({ guildID: interaction.guild.id });
    if (!data[0])
        return await embedSender(`Shop Not Found!`, "This Server Does Not Have An Active Shop. \nUse `/shop create` to make one", "ffcccb", interaction.guild.iconURL() ? interaction.guild.iconURL() : "");
    await shopSchema.findOneAndUpdate({ guildID: interaction.guild.id }, { description: descriptionString });
    return await embedSender(`Shop Description Updated!`, `Your Server Shop Description Has Been Updated To \`${descriptionString}\``, "39FF14", data[0]?.image
        ? data[0]?.image
        : interaction.guild.iconURL()
            ? interaction.guild.iconURL()
            : "");
};
async function slash(client, interaction, emojiData) {
    let command = await interaction.options.getSubcommand();
    if (command == "create") {
        if (!interaction.member.permissions.has("ADMINISTRATOR") &&
            !interaction.member.permissions.has("MANAGE_GUILD"))
            return await interaction.reply({
                content: "You Need Manage Server Permission To Run This Command",
                ephemeral: true,
            });
        let name = await interaction.options?.get("shop_name")?.value;
        let channel = await interaction.options?.get("channel")?.value;
        let embed = await create(name, channel, interaction, emojiData);
        await interaction.reply({ embeds: [embed] });
    }
    else if (command == "view") {
        let name = await interaction.options?.get("shop_name")?.value;
        if (!name)
            name = "me";
        let embed = await view(name, interaction, emojiData);
        await interaction.reply({ embeds: [embed] });
    }
    else if (command == "image") {
        function validURL(str) {
            var pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
            return !!pattern.test(str);
        }
        let URL = await interaction.options?.get("url")?.value;
        let check = validURL(URL);
        if (check == false)
            return await interaction.reply({
                embeds: [
                    embedSender(`Invalid URL Provided`, `Please Provide A Valid URL`, "ffcccb", ""),
                ],
            });
        let embed = await image(URL, interaction, emojiData);
        await interaction.reply({ embeds: [embed] });
    }
    else if (command == "description") {
        let descriptionString = await interaction.options?.get("description")?.value;
        let embed = await description(descriptionString, interaction, emojiData);
        await interaction.reply({ embeds: [embed] });
    }
}
exports.slash = slash;
