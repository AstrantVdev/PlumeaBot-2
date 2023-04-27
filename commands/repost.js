const { SlashCommandBuilder } = require('discord.js')
const mes =  require('../utils/message')
const { c } =  require("../config")
const pdf = require("../utils/pdf")

module.exports = {
    data(){
        return new SlashCommandBuilder()
            .setName('repost')
            .setDescription("Permet de reposter le fichier d'un de vos texte")
            .addStringOption(option => option
                .setName("id_text")
                .setDescription("Le id_text du texte, ex : LGUIDE002-000ASRA")
                .setMinLength(17)
                .setMaxLength(17)
                .setRequired(true))
            .addAttachmentOption(option => option
                .setName("fichier")
                .setDescription("Votre texte sous format PDF")
                .setRequired(true))

    },

    async execute(inter) {
        const id_text = inter.options.getString("id_text")
        const file = inter.options.getAttachment("fichier")
        const id = inter.member.id

        const fileId = await T_TAB.findOne({ where: { authorId: id, id_text: id_text }, attributes: ['fileMesId'], raw: true })

        if(fileId){

            if(pdf.checkExtension(file, "pdf")){
                pdf.rename(file, id_text)
                await mes.editMes(c.channels.safe, fileId.fileMesId, { files: [file] })

                await mes.interSuccess(inter)

            }else{
                await mes.interError(inter, "Ce fichier n'est pas un .pdf")

            }

        }else{
            await mes.interError(inter, "Ce id_text n'existe pas !")

        }

    }

}