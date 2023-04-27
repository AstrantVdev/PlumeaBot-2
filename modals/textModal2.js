const { ModalBuilder, TextInputBuilder, ActionRowBuilder,
    GuildForumThreadManager, EmbedBuilder
} = require('discord.js')
const mUtils = require("../utils/member")
const tUtils = require("../utils/text")
const config = require("../config").c
const mes = require("../utils/message")
const mesUtils = require("../utils/message")
const pdf = require("../utils/pdf")
const link = require("../buttons/link")

module.exports = {
    name: 'textModal2',

    async execute(inter){
        const split = inter.customId.split('/')
        const textUUID = split[1]
        const textModelUUID = split[2]
        const PostProcess = split[3]

        const member = inter.member
        const id = member.id

        const title = inter.fields.getTextInputValue('title')
        const desc = inter.fields.getTextInputValue('desc')
        let chap = inter.fields.getTextInputValue('chap')

        chap = chap.split('-')
        let chap1 = -1
        let chap2 = -1
        if(chap.length > 0){
            chap1 = chap[0]

            if(chap.length > 1){
                chap2 = chap[1]

            }
        }

        const erButton = require("../buttons/textModal2").get(textUUID, textUUID, PostProcess)
        let errorMes = ''

        if(chap1 === -1){
            errorMes += "Tu n'as pas mis de id_chapitre valide !"
        }

        const oldId_Text = await tUtils.getId_Text(textUUID)
        const oldDesc = await tUtils.getDesc(textUUID)
        const oldTitle = await tUtils.getTitle(textUUID)

        await tUtils.setTitle(textUUID, title)
        await tUtils.setDesc(textUUID, desc)

        const words = await tUtils.getWords(textUUID)
        const locked = await tUtils.isProtected(textUUID)
        const themes =  await tUtils.getThemes(textUUID)

        chap1 = parseInt(chap1)
        chap2 = parseInt(chap2)
        function checkChap(chap, n){
            const e = "Ton chap"+n+" "

            if(isNaN(chap)) {
                errorMes += e + "Ce n~est pas un nombre que tu as donné là !\n"
            }else{

                if(chap >= 0){

                    if((chap - Math.floor(chap)) === 0){
                        return true
                    }else{
                        errorMes +=  e + "Pas de nombre à virgule stp -_-\n"
                    }

                }else{
                    errorMes += e + "C'est un nombre negatif ca... !\n"
                }

            }

        }

        if(checkChap(chap1, 1)){ await tUtils.setChap1(textUUID, chap1) }


        let id_text_chap = ('000' + chap1).slice(-3)

        if(chap2 !== -1){

            if(!isNaN(chap2)) {
                if(checkChap(chap2, 2)){ await tUtils.setChap2(textUUID, chap2) }
            }

        }else{
            chap2 = 0
            await tUtils.setChap2(textUUID, 0)
        }
        id_text_chap += '-' + ('000' + chap2).slice(-3)

        const id_text_title = await tUtils.getIdTitle(textUUID)
        const id_text_nick = await mUtils.getNick(id)
        const id_text = (id_text_title + id_text_chap + id_text_nick).toUpperCase()

        const id_textExist = await tUtils.id_textExist(id_text, id, textUUID)
        if(id_textExist){
            errorMes += "le id_text_titre, et les deux chapitres sont identiques à une de tes oeuvre déjà postée ! Si tu le souhaites tu peux l'éditer au lieu de la reposter :D"
        }else{
            await tUtils.setId_Text(textUUID, id_text)
        }

        if(errorMes !== ''){
            errorMes += "\n__Appuis sur le bouton__  ↓↓↓"
            await mes.interError(inter, { content: errorMes, components: [erButton] })
        }

        if(PostProcess === '1'){
            if(errorMes !== ''){ return }

            const fileId = await mUtils.getFileInPostingMesId(id)
            const fileMes = await mes.getMes(config.channels.safe, fileId)
            const file  = fileMes.attachments.first()
            if(!file){
                await mes.interError(inter, "le fichier n~existe plus mon cher. Je te conseille d'aller mentionner le staff à ce sujet", 1)
                return
            }

            await inter.deferReply({ephemeral: true})

            pdf.rename(file, id_text)

            const spaceEmbed = new EmbedBuilder()
                .setColor(0x2C2F33)
                .setTitle('.\n.\n.')

            const textEmbed = mesUtils.newEmbed()
                .setTitle(title)
                .setAuthor({
                    name: id_text + ' | '+ words + ' mots',
                    iconURL: member.displayAvatarURL(),
                    url: "https://www.youtube.com/watch?v=zRs58D34OLY" })
                .setDescription(`${desc} \n\n ||[${textUUID}](${fileMes.url})||`)

            const safeEmbed = mes.newEmbed()
                .setTitle(textUUID)
                .setDescription(`${member}\n ${id_text}`)

            await mes.editMes(config.channels.safe, fileId, { files: [file], embeds: [safeEmbed] })

            const delButton = require('../buttons/textDelete').get(textUUID)
            const editButton = require('../buttons/textEdit').get(textUUID)

            let getButton
            if(locked){
                getButton = require('../buttons/textAsk').get(textUUID)
            }else{
                getButton = require('../buttons/textGet').get(textUUID)
            }

            const questionsEmbed = tUtils.getQuestionsEmbed(
                await tUtils.getQuestions(textUUID)
            )
            const postIds = await this.forumPost(
                id_text,
                member,
                {
                    content: `***${title.toUpperCase()}***`,
                    embeds: [textEmbed, questionsEmbed]
                },
                themes
            )

            const lockButton = require("../buttons/textProtect").get(textUUID, true)

            const postLinkButton = link.get(postIds[2], "Avis", '🖊️')

            const getLinkButton = link.get(postIds[2], "Lire", '📖')

            const buttons = new ActionRowBuilder().setComponents(getLinkButton, postLinkButton, editButton, delButton, lockButton)
            let textMes = await mes.sendMes(config.channels.text, { embeds: [spaceEmbed, textEmbed], components: [buttons]})

            const textLinkButton = link.get(textMes.url, "Lien")

            const postButtons = new ActionRowBuilder().setComponents(getButton, textLinkButton, editButton, delButton, lockButton)
            await mes.editMes(postIds[0], postIds[1], {components: [postButtons]})

            const safeButtons = new ActionRowBuilder().setComponents(textLinkButton, postLinkButton, editButton, delButton, lockButton)
            await mes.editMes(config.channels.safe, fileId, {components: [safeButtons]})

            await tUtils.setTextMesId(textUUID, textMes.id)
            await tUtils.setPostId(textUUID, postIds[0])
            await tUtils.setPostMesId(textUUID, postIds[1])
            await tUtils.setFileMesId(textUUID, fileId)

            await tUtils.sendPostTutorial()

            await mUtils.addWeeklyWords(id, words)
            await mUtils.addTextUUID(id, textUUID)
            await mUtils.setFileInPostingMesId(id, null)
            await mUtils.setTextInPostingUUID(id, null)

            await mes.interSuccess(inter, null, true)

        }else{
            if(oldId_Text !== id_text || oldDesc !== desc || title !== oldTitle){
                const mesId1 = await tUtils.getTextMesId(textUUID)
                const postId = await tUtils.getPostId(textUUID)
                const postMesId = await tUtils.getPostMesId(textUUID)
                let textMes = await mes.getMes(config.channels.text, mesId1)
                let postMes = await mes.getMes(postId, postMesId)

                let embed = textMes.embeds[1]

                if(oldId_Text !== id_text && !id_textExist){
                    const postChannel = await client.channels.fetch(postId)
                    await postChannel.setName(id_text + " | <@" + id + ">")

                    const author = embed.author.name
                    const words = author.split('|')[1]
                    embed.data.author.name = id_text + " | " + words

                    const safeMesId = await tUtils.getFileMesId(textUUID)
                    const safeMes = await mes.getMes(config.channels.safe, safeMesId)

                    const file = safeMes.attachments.first()
                    pdf.rename(file, id_text)

                    const safeEmbed = safeMes.embeds[0]
                    const safeEmbedDesc = safeEmbed.description
                    safeEmbed.data.description = safeEmbedDesc.split("\n")[0] + "\n" + id_text

                    await mes.editMes(config.channels.safe, safeMesId, {files:[file], embeds: [ safeEmbed]})

                }

                if(oldDesc !== desc){
                    const embedDesc = embed.description
                    embed.data.description =  desc + "\n" + embedDesc.split("\n")[1]
                }

                if(oldTitle !== title){
                    embed.data.title = title
                }

                await mes.editMes(config.channels.text, mesId1, { embeds: [textMes.embeds[0], embed] })
                await mes.editMes(postId, postMesId, { content: `***${title.toUpperCase()}***`, embeds: [embed, postMes.embeds[1]] })

            }

            if(errorMes === ''){ await mes.interSuccess(inter) }

        }

    },

    async get(textUUID, textModelUUID, postProcess){
        const modal = new ModalBuilder()
            .setCustomId(this.name + "/" + textUUID + "/" + textModelUUID + "/" + postProcess)
            .setTitle('Formulaire 3/3 - Renseignements')

        let comp = []

        const title =
            new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Le titre en entier (autorisés: a-z) :')
                .setPlaceholder("ex: Le Guide de Para")
                .setMaxLength(64)
                .setStyle('Short')
                .setRequired(true)

        const chap =
            new TextInputBuilder()
                .setCustomId('chap')
                .setLabel('ID_chapitres')
                .setPlaceholder("ex: 0  |  ex: 1  |  ex: 1-2")
                .setMaxLength(7)
                .setStyle('Short')
                .setRequired(true)

        const desc =
            new TextInputBuilder()
                .setCustomId('desc')
                .setLabel('Description du texte :')
                .setStyle('Paragraph')
                .setRequired(true)


        //autocompletion
        if(textModelUUID !== '0'){
            let chap1Value = await tUtils.getChap1(textModelUUID)
            if(textModelUUID !== textUUID){ chap1Value ++ }

            let chapValue = chap1Value.toString()

            let chap2Value = await tUtils.getChap2(textModelUUID)
            if(chap2Value !== 0){
                if(textModelUUID !== textUUID){ chap2Value ++ }
                chapValue += '-' + chap2Value
            }

            title.setValue(await tUtils.getTitle(textModelUUID))
            chap.setValue(chapValue)
            desc.setValue(await tUtils.getDesc(textModelUUID))

        }

        comp = [title, chap, desc]
        comp.forEach(c => {

            modal.addComponents(
                new ActionRowBuilder()
                    .addComponents(c)

            )

        })
        
        return modal

    },

    async forumPost(id_text, user, message, themes){
        themes = tUtils.getThemesIdsByNames(themes)

        const forum = await client.channels.fetch(config.channels.textForum)

        let post =  await new GuildForumThreadManager(forum).create({
            name: `${id_text}  | ${user}`,
            message: message,
            reason: "Create textPost for uuid",
            appliedTags: themes
        })

        const postId = post.id
        post = await client.channels.fetch(postId)
        const mes = await post.messages.fetch()
        const mesId = mes.last().id
        const mesUrl = mes.last().url

        return [postId, mesId, mesUrl]

    }

}