const { ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js')
const mes = require("../utils/message")
const tUtils = require("../utils/text")

module.exports = {
    name: 'textIdTitle',

    async execute(inter){
        const split = inter.customId.split('/')
        const textUUID = split[1]
        let textModelUUID = split[2]
        const PostProcess = split[3]

        const id_text_title = inter.fields.getTextInputValue('id_text_title')
        const id = inter.member.id

        if(/^[a-zA-Z()]+$/.test(id_text_title)){
            await tUtils.setIdTitle(textUUID, id_text_title.toUpperCase())

            if(PostProcess === '1'){
                const textModelUUID = await tUtils.getSimilarTextUUID(id_text_title, id, textUUID)
                const button = await require("../buttons/textModal1").get(textUUID, textModelUUID, PostProcess)
                await mes.interSuccess(
                    inter,
                    { content: "Une requête particulière ? Un point à travailler ? Dites tout à vos lecteurs.\n" +
                            "Ces questions sont facultatives" +
                            " \n __Appuis sur le bouton__  ↓↓↓", components: [button] })

            }else{
                await mes.interSuccess(inter)
            }


        }else{
            const button = require("../buttons/textModalTitle").get(textUUID, textModelUUID, PostProcess)
            await mes.interError(
                inter,
                { content: "Seuls les caractères alphabétiques sont autorisés\n __Appuis sur le bouton__  ↓↓↓", components: [button] }

            )

        }

    },

    async get(textUUID, textModelUUID, postProcess){
        const modal = new ModalBuilder()
            .setCustomId(this.name + "/" + textUUID + "/" +textModelUUID + "/" + postProcess)
            .setTitle('ID_titre')

        const id_text_title = new TextInputBuilder()
            .setCustomId('id_text_title')
            .setLabel('6 lettres représentant le titre')
            .setPlaceholder('ex : LGUIDE pour Le Guide de Para')
            .setMinLength(6)
            .setMaxLength(6)
            .setStyle("Short")
            .setRequired(true)

        if(textModelUUID !== '0'){
            id_text_title.setValue(await tUtils.getIdTitle(textModelUUID))
        }

        return modal.addComponents(
            new ActionRowBuilder()
                .addComponents(id_text_title))

    }

}