const { SlashCommandBuilder } = require('discord.js')
const mes =  require('../utils/message')
const m = require('../utils/member')
const { config } = require("../config")

module.exports = {
	data(){
		return new SlashCommandBuilder()
			.setName('profil')
			.setDescription('Profil d~un plumeen')
			.addUserOption(option => option
				.setName('user')
				.setDescription('plumeen')
				.setRequired(true))

	},

	async execute(inter) {
		const member = inter.options.getMember('user')
		const id = member.id

		let nick = await m.getNick(id)
		if(nick === 'o'){ nick = "null" }
		let joinDate = await m.getJoinDate(id)
		joinDate = parseInt((joinDate.getTime() / 1000).toFixed(0))
		const plumes = await m.getPlumes(id)
		const coins = await m.getCoins(id)
		const weeklyWords = await m.getWeeklyWords(id)

		let message = `**Profil de: <@${member.id}>**\n\n`
		message += `Nick: *${nick}*\n`
		message += `Arrivée: <t:${joinDate}> <t:${joinDate}:R>\n`
		message += `Plumes: *${plumes}*\n`
		message += `Coins: *${coins}*\n`
		message += `MotsHebdo: *${weeklyWords}*\n`

		const textsUUIDs = m.getTextsUUIDs(id)
		if(textsUUIDs){
			message += 'Textes: \n'
			for(const t in textsUUIDs){
				message += `- ${t} \n`
			}

		}

		const json = config.plumesRoles
		const roles = new Map(Object.entries(json))

		let color = mes.color.blue
		await roles.forEach(async (args, roleid)=>{

			if(await member.roles.cache.find(r => r.id === roleid)){
				color = args.color
			}

		})

		const embed = mes.newEmbed(color)
			.setDescription(`**Profil de: <@${member.id}>**\n\n· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · \n`)
			.setFields(
				{ name: "Pseudo :", value: `*${nick}*`, inline: true },
				{ name: "Plumes :", value: `*${plumes}*`, inline: true },
				{ name: "Coins :", value: `*${coins}*`, inline: true },
				{ name: "MotsHebdo :", value: `*${weeklyWords}*`, inline: true },
				{ name: "Arrivée: ", value: `<t:${joinDate}> <t:${joinDate}:R>`},
			)

		await mes.interSuccess(inter, { embeds : [embed], ephemeral: false })

	}

}