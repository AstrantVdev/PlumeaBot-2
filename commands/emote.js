const { SlashCommandBuilder } = require('discord.js')
const { c } = require('../config')
const mes = require("../utils/message")
const db = require("../dbObjects")
const editJsonFile = require("edit-json-file")

module.exports = {
	data(){
		return new SlashCommandBuilder()
			.setName('emote')
			.setDescription('plume')

	},

	async execute(inter) {
		await mes.interSuccess(inter, { content: c.emotes.plume, formatted: true, ephemeral: false })

		/*
		const data = editJsonFile("DATA.json")

		const members = await data.get("members.list")

		await inter.deferReply({ ephemeral: true })

		for(let i = 140 ; i < 344 ; i++){
			const m = members[i]
			const id = this.ABCtoInt(m)

			const plumes = await data.get("members." + m + ".plumes")

			const date = await data.get("members." + m + ".date")

			let joinDate = new Date
			joinDate.setFullYear(parseInt(date.slice(0,4)))
			joinDate.setMonth(parseInt(date.slice(4,6)) -1)
			joinDate.setDate(parseInt(date.slice(6,8)))

			let exist = true
			await inter.guild.members.fetch(id)
				.catch(e =>{
					exist = false
				})

			if(exist){
				const m = require("../utils/member")

				if(! await m.exists(id)){

					await db.tabCreate(M_TAB, {
						id: id,
						joinDate: joinDate,
						plumes: plumes
					})

				}

			}

		}

		 */

	},

	ABCtoInt(string){
		string = string.replace(/@/g, "0")
		string = string.replace(/&/g, "1")
		string = string.replace(/~/g, "2")
		string = string.replace(/#/g, "3")
		string = string.replace(/{/g, "4")
		string = string.replace(/§/g, "5")
		string = string.replace(/%/g, "6")
		string = string.replace(/è/g, "7")
		string = string.replace(/à/g, "8")
		string = string.replace(/ç/g, "9")
		return BigInt(string)

	}

}