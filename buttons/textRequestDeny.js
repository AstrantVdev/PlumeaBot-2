const { ButtonBuilder } = require('discord.js')
const mes = require("../utils/message")
const rUtils = require("../utils/textRequests")
const tUtils = require("../utils/text")

module.exports = {
    name: 'textRequestDeny',
    async execute(inter){
        const split = inter.customId.split('/')
        const senderId = split[1]
        const textUUID = split[2]
        const textAuthor = await tUtils.getAuthorId(textUUID)

        if(inter.member.id === textAuthor){
            inter.message.delete()

            const sent = await mes.private(inter.member, rUtils.getDenyMes(textUUID))
            if(sent){
                await rUtils.setOut(senderId, textUUID)

            }else{
                await rUtils.sendDeny(senderId, textUUID)
                await rUtils.setDenied(senderId, textUUID)

            }

            await mes.interSuccess(inter)

        }else{
            await mes.interError(inter, "Ce n~est pas ton texte")
        }

    },

    get(senderId, textUUID){
        return new ButtonBuilder()
            .setCustomId(this.name + "/" + senderId + "/" + textUUID)
            .setLabel('Refuser')
            .setStyle('Danger')

    }

}