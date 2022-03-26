"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modal = exports.buttons = exports.slash = void 0;
const discord_js_1 = require("discord.js");
const v1 = require("uuid").v1;
const embedSender = (title, description, color, thumbnail, footer) => {
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(`${title}`)
        .setDescription(`${description}`)
        .setColor(`#${color}`)
        .setThumbnail(`${thumbnail}`)
        .setFooter({ text: `${footer}` });
    return embed;
};
const orderNow = async (client, name, item, description, interaction, target, channel, emojiData) => {
    const shopSchema = require("../schemas/shopSchema");
    let shopData = await shopSchema.find({ name: name });
    if (!shopData[0])
        return await embedSender(`<a:cross:${emojiData.cross}> Shop Not Found`, "Error 404: `The Shop You Are Trying To Order From Does Not Exist.`", "ffcccb", "", "fail");
    let guild = await client.guilds.fetch(shopData[0]?.guildID);
    if (!guild)
        return await embedSender(`<a:cross:${emojiData.cross}> Shop Server Not Found`, "Error 404: `The Server Which This Shop Belongs To Was Not Found.`", "ffcccb", "", "fail");
    let Sendchannel = await guild.channels.fetch(shopData[0].channelID);
    if (!Sendchannel)
        return await embedSender(`<a:cross:${emojiData.cross}> Shop Channel Not Found`, "Error 404: `The Server Which This Shop Belongs To Was Not Found.`", "ffcccb", "", "fail");
    let ID = v1().split("-")[0];
    let embed = new discord_js_1.MessageEmbed()
        .setTitle(`<a:tick:${emojiData.tick}> New Order From ${interaction.guild.name} For ${item}`)
        .setDescription(`<:age:${emojiData.age}> Order ID: \`${ID}\` \n<a:shop:${emojiData.shop}> Shop: \`${shopData[0]?.name}\` \n<:cart:${emojiData.cart}> Item: \`${item}\` \n<:order:${emojiData.order}> Description: \`${description}\` \n<a:swipe:${emojiData.swipe}> Deliver To: <@!${target}> \n<a:hobby:${emojiData.hobby}> Deliver In: <#${channel}> \n<a:hearts:${emojiData.hearts}> Points: \`400\``)
        .setColor("#39FF14")
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: `${ID}` });
    const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
        .setCustomId("order_deliver")
        .setLabel("Deliver")
        .setEmoji(emojiData.tick)
        .setStyle("PRIMARY"), new discord_js_1.MessageButton()
        .setCustomId("deliver_manual")
        .setLabel("Manual")
        .setEmoji(emojiData.swipe)
        .setStyle("PRIMARY"));
    Sendchannel.send({ embeds: [embed], components: [row] });
    embed = new discord_js_1.MessageEmbed()
        .setTitle(`<a:tick:${emojiData.tick}> Order For ${item} Has Been Placed!!`)
        .setDescription(`<:age:${emojiData.age}> Order ID: \`${ID}\` \n<a:shop:${emojiData.shop}> Shop: \`${shopData[0]?.name}\` \n<:cart:${emojiData.cart}> Item: \`${item}\` \n<:order:${emojiData.order}> Description: \`${description}\` \n<a:swipe:${emojiData.swipe}> Deliver To: <@!${target}> \n<a:hobby:${emojiData.hobby}> Deliver In: <#${channel}> \n\n<a:alert:${emojiData.alert}> **Please Wait Upto 24 Hours For The Order To Be Delivered**`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setFooter({ text: `${interaction.user.id} | ${ID}` })
        .setColor("#FF5F1F");
    await require("../schemas/orderSchema").findOneAndUpdate({ orderID: ID }, {
        orderID: ID,
        guildID: interaction.guild.id,
        item: item,
        target: target,
        channelID: channel,
        shopID: shopData[0].guildID,
    }, { upsert: true, new: true });
    await require("../schemas/profileSchema").findOneAndUpdate({ userID: interaction.user.id }, { $inc: { orders: 1 }, name: interaction.user.username }, { upsert: true, new: true });
    return embed;
};
async function slash(client, interaction, emojiData) {
    const random = (data) => {
        if (data.length == 1)
            return data[0];
        else {
            let random = Math.floor(Math.random() * data.length);
            return data[random];
        }
    };
    const shopSchema = require("../schemas/shopSchema");
    let command = await interaction.options.getSubcommand();
    if (command === "market") {
        let shopData = await shopSchema.find();
        if (!shopData[0])
            return await interaction.reply({
                content: "No Shops Available At This Moment",
                ephemeral: true,
            });
        let shop;
        let flag = false;
        let i = 0;
        while (flag == false && i < shopData.length) {
            i++;
            shop = await random(shopData);
            if (parseInt(shop.guildID) != interaction.guild.id) {
                flag = true;
            }
        }
        // if (flag == false)
        //   return await interaction.reply({
        //     content: "No Shops Available At This Moment",
        //     ephemeral: true,
        //   });
        let embed = new discord_js_1.MessageEmbed()
            .setTitle(`<a:tick:${emojiData.tick}> | ${shop.name}`)
            .setDescription(`<a:shop:${emojiData.shop}> Name: \`${shop.name}\` \n<:cart:${emojiData.cart}> Description: \`${shop.description
            ? shop.description
            : "Welcome To My Shop. Please Order"}\` \n<a:upvote:${emojiData.upvote}> Points: \`${shop.points}\` \n<:order:${emojiData.order}> Completed Orders: \`${shop.orders}\``)
            .setThumbnail(shop.image)
            .setColor("#8B008B");
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("order_next")
            .setLabel("Next")
            .setEmoji(emojiData.swipe)
            .setStyle("PRIMARY"), new discord_js_1.MessageButton()
            .setCustomId("order_shop")
            .setLabel("Order")
            .setEmoji(emojiData.tick)
            .setStyle("PRIMARY"));
        await interaction.reply({ embeds: [embed], components: [row] });
    }
    else if (command == "official") {
        const { Modal, TextInputComponent, showModal } = require("discord-modals");
        const modal = new Modal()
            .setCustomId("order-official")
            .setTitle(`Order From The Official Store!`)
            .addComponents([
            new TextInputComponent()
                .setCustomId("official-item")
                .setLabel("The Image You Want To Order")
                .setStyle("SHORT")
                .setMinLength(1)
                .setPlaceholder("Input The Name Of The Item.")
                .setRequired(true),
            new TextInputComponent()
                .setCustomId("official-description")
                .setLabel("Additional Description For Order")
                .setStyle("LONG")
                .setMinLength(10)
                .setPlaceholder("Item Description Here For Better Deliver Quality.")
                .setRequired(true),
        ]);
        showModal(modal, {
            client: client,
            interaction: interaction,
        });
    }
}
exports.slash = slash;
// async function slash2(client: any, interaction: any, emojiData: any) {
//   let command = await interaction.options.getSubcommand();
//   if (command == "official") {
//     let item: String = await interaction.options?.get("item")?.value;
//     let target = await interaction.options?.get("user")?.value;
//     let channel = await interaction.options?.get("channel")?.value;
//     if (!target) target = interaction.user.id;
//     if (!channel) channel = interaction.channel.id;
//     let embed = await orderNow(
//       client,
//       "offical",
//       item,
//       interaction,
//       target,
//       channel,
//       emojiData
//     );
//     await interaction.reply({ embeds: [embed] });
//   } else if (command == "market") {
//     let name: String = await interaction.options?.get("shop")?.value;
//     let item: String = await interaction.options?.get("item")?.value;
//     let target = await interaction.options?.get("user")?.value;
//     let channel = await interaction.options?.get("channel")?.value;
//     if (!target) target = interaction.user.id;
//     if (!channel) channel = interaction.channel.id;
//     if (!name) name = "offical";
//     let embed = await orderNow(
//       client,
//       name,
//       item,
//       interaction,
//       target,
//       channel,
//       emojiData
//     );
//     const row = new MessageActionRow().addComponents(
//       new MessageButton()
//         .setCustomId("order_cancel")
//         .setLabel("Cancel")
//         .setEmoji(emojiData.cross)
//         .setStyle("SECONDARY")
//     );
//     await interaction.reply({ embeds: [embed], components: [row] });
//   }
// }
async function buttons(client, interaction, emojiData) {
    if (interaction.customId == "order_cancel") {
        const orderSchema = require("../schemas/orderSchema");
        await orderSchema.findOneAndDelete({
            orderID: interaction.message.embeds[0]?.footer?.text
                ?.split(" | ")[1]
                .trim(),
        });
        await interaction.update({
            content: `<a:tick:${emojiData.tick}> Order Cancelled`,
            embeds: [],
            components: [],
        });
    }
    else if (interaction.customId == "order_deliver") {
        const { Modal, TextInputComponent, showModal } = require("discord-modals");
        const modal = new Modal()
            .setCustomId("deliver-modal")
            .setTitle(`Deliver Order With ID: ${interaction.message.embeds[0]?.footer?.text}!`)
            .addComponents([
            new TextInputComponent()
                .setCustomId("deliver-id")
                .setLabel("The ID Of The Order")
                .setStyle("SHORT")
                .setMinLength(1)
                .setDefaultValue(interaction.message.embeds[0]?.footer?.text)
                .setPlaceholder("Input Image URL Here. Please Only Send Requested Stuff."),
            new TextInputComponent()
                .setCustomId("deliver-url")
                .setLabel("The Image You Want To Deliver")
                .setStyle("SHORT")
                .setMinLength(4)
                .setPlaceholder("Input Image URL Here. Please Only Send Requested Stuff.")
                .setRequired(false),
            new TextInputComponent()
                .setCustomId("deliver-description")
                .setLabel("Additional Description For Delivery")
                .setStyle("LONG")
                .setMinLength(10)
                .setPlaceholder("Input Description Here If Required. Pass Empty String If Not Required.")
                .setRequired(false),
        ]);
        showModal(modal, {
            client: client,
            interaction: interaction,
        });
    }
    else if (interaction.customId == "order_next") {
        const random = (data) => {
            if (data.length == 1)
                return data[0];
            else {
                let random = Math.floor(Math.random() * data.length);
                return data[random];
            }
        };
        const shopSchema = require("../schemas/shopSchema");
        let shopData = await shopSchema.find();
        let shop;
        let flag = false;
        let i = 0;
        while (flag == false && i < shopData.length) {
            i++;
            shop = random(shopData);
            if (parseInt(shop.guildID) != interaction.user.guildID) {
                flag = true;
            }
        }
        // if (flag == false)
        //   return await interaction.reply({
        //     content: "No Shops Available At This Moment",
        //     ephemeral: true,
        //   });
        let embed = new discord_js_1.MessageEmbed()
            .setTitle(`<a:tick:${emojiData.tick}> | ${shop.name}`)
            .setDescription(`<a:shop:${emojiData.shop}> Name: \`${shop.name}\` \n<:cart:${emojiData.cart}> Description: \`${shop.description
            ? shop.description
            : "Welcome To My Shop. Please Order"}\` \n<a:upvote:${emojiData.upvote}> Points: \`${shop.points}\` \n<:order:${emojiData.order}> Completed Orders: \`${shop.orders}\``)
            .setThumbnail(shop.image)
            .setColor("#8B008B");
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("order_next")
            .setLabel("Next")
            .setEmoji(emojiData.swipe)
            .setStyle("PRIMARY"), new discord_js_1.MessageButton()
            .setCustomId("order_shop")
            .setLabel("Order")
            .setEmoji(emojiData.tick)
            .setStyle("PRIMARY"));
        await interaction.update({ embeds: [embed], components: [row] });
    }
    else if (interaction.customId == "order_shop") {
        const { Modal, TextInputComponent, showModal } = require("discord-modals");
        const modal = new Modal()
            .setCustomId("order-modal")
            .setTitle(`Order From ${interaction.message.embeds[0]?.title
            .split(" ")[1]
            .trim()}!!`)
            .addComponents([
            new TextInputComponent()
                .setCustomId("order-name")
                .setLabel("The Name Of The Shop")
                .setStyle("SHORT")
                .setMinLength(1)
                .setDefaultValue(interaction.message.embeds[0]?.title.split("|")[1].trim())
                .setPlaceholder("Input The Shop Name Here")
                .setRequired(true),
            new TextInputComponent()
                .setCustomId("order-item")
                .setLabel("The Item You Want To Order")
                .setStyle("SHORT")
                .setMinLength(1)
                .setPlaceholder("Input Your Item Name Here")
                .setRequired(true),
            new TextInputComponent()
                .setCustomId("order-description")
                .setLabel("Additional Description For Delivery")
                .setStyle("LONG")
                .setMinLength(5)
                .setPlaceholder("Input Description Of The Item Here")
                .setRequired(true),
        ]);
        showModal(modal, {
            client: client,
            interaction: interaction,
        });
    }
}
exports.buttons = buttons;
async function modal(client, interaction, emojiData) {
    if (interaction.customId == "order-modal") {
        let name = interaction.getTextInputValue("order-name");
        let item = interaction.getTextInputValue("order-item");
        let description = interaction.getTextInputValue("order-description");
        let embed = await orderNow(client, name, item, description, interaction, interaction.user.id, interaction.channel, emojiData);
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("order_cancel")
            .setLabel("Cancel")
            .setEmoji(emojiData.cross)
            .setStyle("SECONDARY"));
        if (embed?.footer?.text != "fail")
            await interaction.reply({ embeds: [embed], components: [row] });
        else
            await interaction.reply({ embeds: [embed], components: [] });
    }
    else if (interaction.customId == "order-official") {
        let item = interaction.getTextInputValue("official-item");
        let description = interaction.getTextInputValue("official-description");
        let embed = await orderNow(client, "Official", item, description, interaction, interaction.user.id, interaction.channel, emojiData);
        const row = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setCustomId("order_cancel")
            .setLabel("Cancel")
            .setEmoji(emojiData.cross)
            .setStyle("SECONDARY"));
        if (embed?.footer?.text != "fail")
            await interaction.reply({ embeds: [embed], components: [row] });
        else
            await interaction.reply({ embeds: [embed], components: [] });
    }
}
exports.modal = modal;
