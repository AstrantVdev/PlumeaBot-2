const fs = require('node:fs')
const path = require('node:path')
const { REST } = require('@discordjs/rest')
const { Routes, Collection } = require('discord.js')

client.commands = new Collection()
const commands = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	const name = command.data().name

	commands.push(command.data().toJSON())
	client.commands.set(name, command)

	console.log("cmd : " + name)

}

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN'])

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error)