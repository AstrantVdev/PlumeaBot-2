const { SlashCommandBuilder } = require('discord.js')
const mes =  require('../utils/message')
const m = require('../utils/member')
const somesUtils = require("../utils/somes")
const mUtils = require("../utils/member")
const tUtils = require("../utils/text")
const uuidCreate = require("uuid");
const pdf = require("../utils/pdf.ts")
const { config } = require('../config')

module.exports = {
	data(){
        return new SlashCommandBuilder()
        .setName('post')
        .setDescription('Permet de poster votre texte')
        .addAttachmentOption(option => option
            .setName("fichier")
            .setDescription("Votre texte sous format PDF")
            .setRequired(true))

    },

    async execute(inter) {
        let file = inter.options.getAttachment("fichier")
        const user = inter.member.user
        const id = user.id

        if(! await m.exists(id)){
            await mes.interError(inter, "Ton compte n'existe pas, va donc sonner les cloches d'un admin ;D", 1)
            return
        }

        if(inter.channel.id !== config.channels.central){
            await mes.interError(inter, "Va faire cette commande dans le <#" + config.channels.central + ">")
            return
        }

        if(!await m.getPlumes(id) <= 0){

            if(pdf.checkExtension(file, "pdf")){

                if(await m.isFileInPosting(id)){

                    try{
                        await m.removeFileInPostingMes(id)
                        const uuid = await m.getTextInPostingUUID(id)
                        await tUtils.remove(uuid)
                    }catch (e) {}

                }

                const uuid  = uuidCreate.v4()

                inter.deferReply({ephemeral: true})

                if(await somesUtils.isWeeklyResetTime()){
                    await mUtils.resetAllWeeklyWords()
                    await somesUtils.setWeeklyResetDate()
                }


                const words = await this.wordsChecker(inter, id, file)
                if(! words){
                    return
                }


                const today = new Date()
                const t = {
                    id: uuid,
                    words: words,
                    date: today,
                    authorId: id
                }

                await tUtils.addText(t)
                await mUtils.setTextInPostingUUID(id, uuid)
                await m.addFileInPosting(user, file)

                if(await m.hasNick(id)){
                    const button = await require('../buttons/textModalTitle').get(uuid, 0, 1)
                    await mes.interSuccess(
                        inter,
                        {content: "Entre le Id_Titre de ton texte \n __Appuis sur le bouton__  ↓↓↓", components: [button] },
                        true)

                }else{
                    const button = require('../buttons/textNick').get(uuid)
                    await mes.interSuccess(
                        inter,
                        {
                            content: "Entre ton pseudo pluméen \n __Appuis sur le bouton__  ↓↓↓",
                            components: [button]
                        },
                        true)

                }

            }else{
                await mes.interError(inter, "Ce n'est pas un pdf que tu me donnes là... Pour convertir ton fichier en pdf tu peux aller sur ce site et regarder dans le menu convertir en pdfhttps://www.ilovepdf.com/fr")

            }

        }else{
            await mes.interError(inter, 'Avant de poster un texte, donne au moins un commentaire et attend de recevoir une plume ;)')

        }

    },

    async wordsChecker(inter, id, file){
        const pdf = require("../utils/pdf.ts")

        let words = await pdf.countWords(file)

        if(await mUtils.toMuchWeeklyWords(id, words)){
            const weekly = await mUtils.getWeeklyWords(id)
            await mes.interError(inter, "NO ! Pas plus de 16k par semaine\nMots: "+words+" | Mots de la semaine: "+weekly, 0, false)

            await mUtils.removeFileInPostingMes(id)
            return null

        }else if (words < 1000){

            await mes.interError(
                inter,
                '**NO !**  Soit un chad et envoie plus de 1000 mots.\nMots Comptés: ' + words
                + '\nSi c~est largement éloigné du nombre de mots réel, converti ton fichier en pdf grâce à ce site :'
                +'\nhttps://www.ilovepdf.com/fr/word_en_pdf',
                0,
                false
            )

            await mUtils.removeFileInPostingMes(id)
            return null

        }

        return words

    }

}