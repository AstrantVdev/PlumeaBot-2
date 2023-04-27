import {Sequelize} from "sequelize"

//Créer un fichier .env dans le root du projet et mettre les variables TOKEN, CLIENT_ID, GUILD_ID...
require('dotenv').config({path: __dirname + '/.env'})

const { Client, GatewayIntentBits } = require('discord.js')
const path = require('path')
const fs = require('fs')
export const DIRNAME = __dirname

export let client = new Client({
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
})

import {setUp} from "./dbManager"
setUp()
eventHandler()
start()

import {getAllFilesInDir} from "./util"
function eventHandler(){
    const eventFiles = getAllFilesInDir("events")

    for (const file of eventFiles) {
        const event = require(file)

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))

        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }
}

function start(){
    client.login(process.env.TOKEN)

}