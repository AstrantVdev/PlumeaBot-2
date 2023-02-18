const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const mes = require("../utils/message")

module.exports = {
    name: 'textEdit',
    async execute(inter){
        const textId = inter.customId.split('/')[1]
        const tUtils = require('../utils/text')
        const textAuthor = tUtils.getAuthorId(textId)

        const member = inter.member
        if(member.user.id === textAuthor || member.permissions.has('ADMINISTRATOR')){
            const textDt = await require("../buttons/textModalTitle").get(textId, textId, 0, false)
            const textModal1 = await require("../buttons/textModal1").get(textId, textId, 0, false)
            const textThemes = await require("../buttons/textThemes").get(textId, textId, 0, false)
            const textModal2 = await require("../buttons/textModal2").get(textId, textId, 0, false)
            const textFile = await require("../buttons/textRepost").get(textId, false)

            const row = new ActionRowBuilder().setComponents(textDt, textModal1, textThemes, textModal2, textFile)

            await mes.interSuccess(inter, "Change ton texte :", null, [row])

        }else{
            await mes.interError(inter, 'Bruh, t~es pas l~auteur, tu peux pas faire ca...')

        }

    },

    get(textId){
        return new ButtonBuilder()
            .setCustomId(this.name+'/'+textId)
            .setLabel('Edit')
            .setStyle('Secondary')
            .setEmoji('⚙️')
    }

}