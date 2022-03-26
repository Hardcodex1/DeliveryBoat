"use strict";
//change guild id
module.exports = function (client) {
    let male = client.emojis.cache?.find((emoji) => emoji.name == "male").id;
    let female = client.emojis.cache?.find((emoji) => emoji.name == "female").id;
    let swipe = client.emojis.cache?.find((emoji) => emoji.name == "swipe").id; //dep
    let hearts = client.emojis.cache?.find((emoji) => emoji.name == "hearts").id;
    let trash = client.emojis.cache?.find((emoji) => emoji.name == "trash").id;
    let alert = client.emojis.cache?.find((emoji) => emoji.name == "alert").id;
    let match = client.emojis.cache?.find((emoji) => emoji.name == "match").id;
    let unmatch = client.emojis.cache?.find((emoji) => emoji.name == "unmatch").id;
    let tick = client.emojis.cache?.find((emoji) => emoji.name == "tick").id;
    let age = client.emojis.cache?.find((emoji) => emoji.name == "age").id;
    let left = client.emojis.cache?.find((emoji) => emoji.name == "left").id;
    let right = client.emojis.cache?.find((emoji) => emoji.name == "right").id;
    let cross = client.emojis.cache?.find((emoji) => emoji.name == "cross").id;
    let help = client.emojis.cache?.find((emoji) => emoji.name == "help").id;
    let arrow = client.emojis.cache?.find((emoji) => emoji.name == "helpArrow").id;
    let bio = client.emojis.cache?.find((emoji) => emoji.name == "bio").id;
    let hobby = client.emojis.cache?.find((emoji) => emoji.name == "hobby").id;
    let shop = client.emojis.cache?.find((emoji) => emoji.name == "shop").id;
    let cart = client.emojis.cache?.find((emoji) => emoji.name == "cart").id;
    let report = client.emojis.cache?.find((emoji) => emoji.name == "report").id;
    let upvote = client.emojis.cache?.find((emoji) => emoji.name == "upvote").id;
    let deliver = client.emojis.cache?.find((emoji) => emoji.name == "deliver").id;
    let order = client.emojis.cache?.find((emoji) => emoji.name == "order").id;
    const data = {
        male,
        female,
        swipe,
        hearts,
        trash,
        alert,
        match,
        unmatch,
        tick,
        age,
        cross,
        left,
        right,
        help,
        arrow,
        bio,
        hobby,
        cart,
        shop,
        report,
        upvote,
        deliver,
        order,
    };
    return data;
};
