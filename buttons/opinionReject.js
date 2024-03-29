const { ButtonBuilder, ActionRowBuilder} = require('discord.js')
const mes = require("../utils/message")
const oUtils = require("../utils/opinion")
const  { config } = require("../config")
const somes = require("../utils/somes")

module.exports = {
    name: 'opinionReject',

    async execute(inter){
        const uuid = inter.customId.split('/')[1]
        const senderId = await oUtils.getSenderId(uuid)

        if(! await somes.memberCheckRoles(inter.member, [config.roles.guard, config.roles.staff])){
            await mes.interError(inter, "Tu fais quoi là -_-")
            return
        }

        await oUtils.delOne(uuid)

        await inter.message.edit({ components: [] })

        const ticket = await client.channels.fetch(config.channels.ticket)
        const embed = mes.newEmbed(mes.COLOR.yellow)
            .setDescription(`Désolé mais ton commentaire a été invalidé... Si aucune explication n'est fournie ci-dessous, crée un ${ticket}`)

        await mes.interSuccess(inter, { content: `<@${senderId}>`, embeds: [embed], ephemeral: false, formatted: true })

    },

    get(uuid, row){
        const button = new ButtonBuilder()
            .setCustomId(this.name + "/" + uuid)
            .setLabel('Rejeter')
            .setStyle('Danger')

        if(row){
            return new ActionRowBuilder()
                .setComponents(buttons)
        }
        return button

    }

}