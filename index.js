//Faut créer un fichier .env dans le root du projet et mettre les variables TOKEN, CLIENT_ID, GUILD_ID...
require('dotenv').config({path: __dirname + '/.env'})

const { Client, GatewayIntentBits } = require('discord.js')
const path = require('path')
const fs = require('fs')
global.DIRNAME = __dirname

global.client = new Client({
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

//DATABASE
const Sequelize = require('sequelize')
global.sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect: 'postgres',
    logging: false,
    port: process.env.DB_PORT,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
      }

    })

sequelize
        .authenticate()
        .then(async () => {
            await console.log('Connection has been established successfully.')
            await require('./dbObjects').setUp()

        })


//EventHandler
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)
	const event = require(filePath)
    
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
		
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}

//start
start()

function start(){
    client.login(process.env.TOKEN)

}