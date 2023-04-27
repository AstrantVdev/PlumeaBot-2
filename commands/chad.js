const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { c } = require('../config')
const mes = require("../utils/message")

module.exports = {
	data(){
        return new SlashCommandBuilder()
            .setName('chad')
            .setDescription('chad')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addIntegerOption(option => option
                .setName('giga_chad_power_intensity')
                .setDescription('Giga Chad power intensity')
                .setRequired(true))

    },

	async execute(inter) {
        const n = inter.options.getInteger('giga_chad_power_intensity')

        await mes.interSuccess(inter, 'GIGA CHAD!!!')

        const chad = c.messageReplies.CHAD

        for (let i = 0 ; i < n ; i++) {
            inter.channel.send(chad)
        } 

	}

}