const { SlashCommandBuilder } = require('discord.js')
const mes = require("../utils/message")

module.exports = {
	data(){
        return new SlashCommandBuilder()
            .setName('random')
            .setDescription('Donne un nombre au hasard')
            .addIntegerOption(option => option
                .setMinValue(1)
                .setMaxValue(100)
                .setName('faces')
                .setDescription('Nombre de faces du dé virtuel (1-100')
                .setRequired(true))

    },

	async execute(inter) {
        let n = inter.options.getInteger('faces')
        const r = Math.floor(Math.random() * (n + 1))

        await mes.interSuccess(inter, {content: `||     ${r}     || sur ${n} !\n^^`, ephemeral : true})

	}

}