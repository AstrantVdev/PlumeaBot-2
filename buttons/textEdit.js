const { ButtonBuilder, ActionRowBuilder } = require('discord.js')
const mes = require("../utils/message")
const somes = require("../utils/somes");
const {c} = require("../config");

module.exports = {
    name: 'textEdit',

    async execute(inter){
        const textId = inter.customId.split('/')[1]
        const tUtils = require('../utils/text')
        const textAuthor = await tUtils.getAuthorId(textId)

        const member = inter.member
        if(member.user.id === textAuthor || await somes.memberCheckRoles(inter.member, [c.roles.staff])){
            const textId_Text = await require("../buttons/textModalTitle").get(textId, textId, 0, false)
            const textModal1 = await require("../buttons/textModal1").get(textId, textId, 0, false)
            const textThemes = await require("../buttons/textThemes").get(textId, textId, 0, false)
            const textModal2 = await require("../buttons/textModal2").get(textId, textId, 0, false)
            const textFile = await require("../buttons/textRepost").get(textId, false)

            const row1 = new ActionRowBuilder().setComponents(textId_Text, textModal1, textThemes)
            const row2 = new ActionRowBuilder().setComponents(textModal2, textFile)

            await mes.interSuccess(inter, { content: "Change ton texte :", components: [row1, row2] })

        }else{
            await mes.interError(inter, 'Bruh, t~es pas l~auteur, tu peux pas faire ca...')

        }

    },

    get(textId){
        return new ButtonBuilder()
            .setCustomId(this.name+'/'+textId)
            .setLabel('Editer')
            .setStyle('Secondary')
            .setEmoji('⚙️')
    }

}