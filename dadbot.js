const Discord = require('discord.js');
const { PREFIX, TOKEN, GIPHY_API } = require("./config.json")
const client = new Discord.Client();

import { ICanHazDadJoke } from '@ffflorian/icanhazdadjoke';
const iCanHazDadJoke = new ICanHazDadJoke();


let GphApiClient = require("giphy-js-sdk-core");
let giphy = GphApiClient(GIPHY_API);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    let joke = "";
    if (msg.content.toLowerCase().startsWith(`${PREFIX}joke`)) {
        iCanHazDadJoke.api.getRandom().then(result => {
            joke = result.joke;
        }).then(giphy.search("gifs", { "q": "laughing" })
            .then((response) => {
                let gifs = response.data.length();
                let index = Math.floor((Math.random() * 10) + 1) % gifs;
                let laughing = response.data[index];
                msg.channel.send(joke + {
                    files: [laughing.images.fixed_height.url]
                });
            }).catch(() => {
                msg.channel.send("🤒 I'm not feeling well.")
            })
        )
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase().startsWith(`${PREFIX}dadbot`)) {
        //msg.reply(`Hello ${name}`);
        msg.channel.send("🧔 Want to hear a joke? Type !joke.");
    }
});



client.login(TOKEN);