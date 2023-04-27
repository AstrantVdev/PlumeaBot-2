const { ActionRowBuilder, StringSelectMenuBuilder  } = require('discord.js')
const mes = require("../utils/message")
const tUtils = require("../utils/text")
const { c } = require("../config")

module.exports = {
    name: 'textProtect',

    async execute(inter){
        const answer = inter.values
        const split = inter.customId.split('/')
        const textUUID = split[1]

        let newLock = null
        if(answer.includes('1')) {

            if(! await tUtils.isProtected(textUUID)){
                newLock = true

            }

        }else{

            if(await tUtils.isProtected(textUUID)){
                newLock = false

            }

        }

        if(newLock !== null){
            const lockButton = require("../buttons/textProtect").get(textUUID, newLock)
            const safeMesId = await tUtils.getFileMesId(textUUID)
            const textMesId = await tUtils.getTextMesId(textUUID)
            const postId = await tUtils.getPostId(textUUID)
            const postMesId = await tUtils.getPostMesId(textUUID)

            await mes.updateMesComp(c.channels.safe, safeMesId, lockButton, 4)
            await mes.updateMesComp(c.channels.text, textMesId, lockButton, 4)
            await mes.updateMesComp(postId, postMesId, lockButton, 4)

            let getButton
            if(newLock){
                getButton =  require("../buttons/textAsk").get(textUUID)
            }else{
                getButton =  require("../buttons/textGet").get(textUUID)
            }

            await mes.updateMesComp(postId, postMesId, getButton, 0)

            await tUtils.setProtected(textUUID, newLock)

        }

        await mes.interSuccess(inter)

    },

    async get(textUUID){

        return new ActionRowBuilder()
            .setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(this.name + "/" + textUUID)
                    .setPlaceholder('accéder au texte que sur demande')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setOptions(
                        { label: "non", description: "non, je ne veux pas", value: '0'  },
                        { label: "oui", description: "oui, je le veux", value: '1' }

                    ))

    }

}