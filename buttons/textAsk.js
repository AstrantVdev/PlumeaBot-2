const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const mes = require("../utils/message")
const rUtils = require("../utils/textRequests")
const { config } = require("../config")

module.exports = {
    name: 'textAsk',

    async execute(inter){
        const textId = inter.customId.split('/')[1]
        const id = inter.member.id

        let date = await rUtils.getMemberRequestDate(id, textId)
        if(! date){
            const message = await rUtils.sendMes(inter.member.user, textId)
            await rUtils.addOne(message.id, id, textId)

            await mes.interSuccess(inter, "L'accès à ce texte est limité. Une demande a été faite dans le salon <#" + config.channels.textRequest + ">")

        }else{
            date.setDate(date.getDate() + 8)
            date = ((date.getTime() / 1000).toFixed(0))
            await mes.interError(inter, `Vous pourrez renvoyer une demande le <t:${date}> <t:${date}:R>`)

        }

    },

    get(textId){
        return new ButtonBuilder()
            .setCustomId(this.name + '/' + textId)
            .setLabel('Demander le fichier')
            .setStyle('Primary')

    }

}