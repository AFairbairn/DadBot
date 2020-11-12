const Discord = require('discord.js');
const { PREFIX } = require("./config.json");
require('dotenv').config();
const client = new Discord.Client();

var GphApiClient = require("giphy-js-sdk-core")
giphy = GphApiClient(process.env.GIPHY_API)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if (msg.content.toLowerCase().startsWith(`${PREFIX}joke`)) {
        let joke = "";
        fetch("https://icanhazdadjoke.com/", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
            .then(async (response) => {
                let data = await response.json();
                joke = data.joke;
                return giphy.search("gifs", { "q": "laughing" })
            })
            .then((response) => {
                let len = response.data.length;
                let index = Math.floor((Math.random() * 10) + 1) % len;
                let gif = response.data[index];
                msg.channel.send(joke, {
                    files: [gif.images.fixed_height.url]
                });
            })
            .catch(() => {
                msg.channel.send("🤒 I'm not feeling well.")
            })
    } else if (msg.content.toLowerCase().startsWith(`${PREFIX}dance`)) {
        giphy.search("gifs", { "q": "dance" })
            .then((response) => {
                let len = response.data.length;
                let index = Math.floor((Math.random() * 10) + 1) % len;
                let gif = response.data[index];
                msg.channel.send({
                    files: [gif.images.fixed_height.url]
                });
            })

    } else if (msg.content.toLowerCase().startsWith(`${PREFIX}advice`)) {
        fetch("https://badadvice.rest/api/random", {
            method: "GET"
        })
            .then(async (response) => {
                let advice = await response.json();
                msg.channel.send(advice);
            })
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase().startsWith(`${PREFIX}dadbot`)) {
        msg.channel.send("🧔 What I can do:\
         \n- Want to hear a joke? Type !joke.\
         \n- Want to see a dance? Type !dance.\
         \n- Need some advice? Type !advice.");
    }
});

client.login(process.env.TOKEN);