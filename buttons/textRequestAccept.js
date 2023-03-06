const { ButtonBuilder } = require('discord.js')
const mes = require("../utils/message")
const rUtils = require("../utils/textRequests")
const tUtils = require("../utils/text")

module.exports = {
    name: 'textRequestAccept',

    async execute(inter){
        const split = inter.customId.split('/')
        const senderId = split[1]
        const textUUID = split[2]
        const textAuthor = await tUtils.getAuthorId(textUUID)

        if(inter.member.id === textAuthor){
            inter.deferReply({ ephemeral: true })

            const sent = await tUtils.sendFile(textUUID, await inter.guild.members.fetch(senderId))
            await inter.message.edit({ components: [], content: `<@${textAuthor}> | ACCEPTE ✅` })

            if(sent){
                await rUtils.removeOne(senderId, textUUID)

            }else{
                const message = await rUtils.sendAccept(senderId, textUUID)
                await rUtils.setMesId(senderId, textUUID, message.id)

                await rUtils.setDate(senderId, textUUID, new Date)
                await rUtils.setAccepted(senderId, textUUID)

            }

            await mes.interSuccess(inter, null, true)

        }else{
            await mes.interError(inter, "Ce n~est pas ton texte")
        }

    },

    get(senderId, textUUID){
        return new ButtonBuilder()
            .setCustomId(this.name + "/" + senderId + "/" + textUUID)
            .setLabel('Accepter')
            .setStyle('Success')

    }

}
