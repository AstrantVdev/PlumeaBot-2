const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const mes =  require('../utils/message')
const { c } = require('../config')
const oUtils = require("../utils/opinion")
const m = require("../utils/member")

module.exports = {
	data(){
        return new SlashCommandBuilder()
            .setName('plumes')
            .setDescription('Ajoute un nombre de plumes à un' + c.string.inhab + ', négatif ou positif, au choix')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addUserOption(option => option
                .setName('user')
                .setDescription('Utilisateur')
                .setRequired(true))
            .addIntegerOption(option => option
                .setMinValue(-99)
                .setMaxValue(99)
                .setName('plumes')
                .setDescription('Nombre de Plumes à rajouter/enlever')
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison d'ajout des plumes"))

    },
        
    async execute(inter) {
        const user = inter.options.getMember('user')
        let p = inter.options.getInteger('plumes')

        let reason = "Plumes ajoutées à la main"
        const userReason = inter.options.getString('reason')
        if (userReason) {
            reason = userReason
        }

        await inter.deferReply({ ephemeral: true })

        if(await m.exists(user.id)){
            await oUtils.confirm(user, p, reason, inter.member, inter)

            await mes.interSuccess(inter, null, true)

        }else{
            await mes.interError(inter, "Cet utilisateur n'est pas enregistré dans la db !", 1)

        }
                
    }

}