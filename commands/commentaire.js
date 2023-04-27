const { SlashCommandBuilder, ActionRowBuilder} = require('discord.js')
const mes =  require('../utils/message')
const tUtils = require("../utils/text")
const { c } = require("../config")
const oUtils = require("../utils/opinion")
const uuidCreate = require("uuid");

module.exports = {
    data(){
        return new SlashCommandBuilder()
            .setName('commentaire')
            .setDescription('Offffficialiiiise un commentaire')

    },

    async execute(inter) {
        const postId = inter.channel.id
        const textUUID = await tUtils.getTextUUIDByPostId(postId)
        const member = inter.member
        const id = member.id

        if(!textUUID){
            const postChannel = await client.channels.fetch(c.channels.textForum)
            await mes.interError(inter, `Va dans le channel associé au texte pour poster ton ${postChannel} \n Et si ce poste est fermé c'est que l'auteur a retiré son texte`)
            return
        }

        if(await oUtils.memberOpinionExist(textUUID, id)){
            await mes.interError(inter, "Tu as déjà commenté ce texte ! Si des mises à jours importantes du texte méritent un nouveau retour demande à l'auteur d'effacer son ancien texte et de le reposter et pas d'utiliser /repost, en effet ce la permet de mettre au courrant tout le monde que leurs commentaire comptent à nouveau ! :D")
            return
        }

        let words = await tUtils.getWords(textUUID)
        words = Math.floor(words/1000)

        let fileUrl = await tUtils.getFileMes(textUUID)
        fileUrl = fileUrl.url

        const uuid  = uuidCreate.v4()

        const embed =
            mes.newEmbed()
                .setAuthor({
                    name: `Avis de ${words} Plumes`,
                    iconURL: member.displayAvatarURL(),
                    url: fileUrl })
                .setDescription(`Par ${member} \n\n||${uuid}||`)

        const refuseButton = require("../buttons/opinionReject").get(uuid)
        const validButton = require("../buttons/opinionValid").get(uuid)
        const buttons = new ActionRowBuilder()
            .setComponents(validButton, refuseButton)

        const message = await inter.channel.send({ content: `<@&${c.roles.staff}>`, embeds: [embed], components: [buttons] })

        await oUtils.createOne(uuid, words, textUUID, id, message.id)

        if(await tUtils.getAuthorId(textUUID) === id){
            await mes.interSuccess(inter, "Tu as du culot toi, je respecte l'audace, bonne chance")

        }else{
            await mes.interSuccess(inter)

        }

    }

}