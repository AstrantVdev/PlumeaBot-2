const { ModalBuilder, TextInputBuilder, ActionRowBuilder,
    GuildForumThreadManager, EmbedBuilder, ButtonBuilder
} = require('discord.js')
const mUtils = require("../utils/member")
const tUtils = require("../utils/text")
const config = require("../config").config
const mes = require("../utils/message")
const mesUtils = require("../utils/message")
const pdf = require("../utils/pdf")

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
        let chap1 = inter.fields.getTextInputValue('chap1')
        let chap2 = inter.fields.getTextInputValue('chap2')
        if(chap2 === ''){ chap2 = -1}

        const oldDt = await tUtils.getDt(textUUID)
        const oldDesc = await tUtils.getDesc(textUUID)
        const oldTitle = await tUtils.getTitle(textUUID)

        await tUtils.setTitle(textUUID, title)
        await tUtils.setDesc(textUUID, desc)

        let errorMes = ''

        const words = await tUtils.getWords(textUUID)
        const password = await tUtils.getPassword(textUUID)
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


        let dt_chap = ('000' + chap1).slice(-3)

        if(chap2 !== -1){

            if(!isNaN(chap2)) {
                if(checkChap(chap2, 2)){ await tUtils.setChap2(textUUID, chap2) }
            }

        }else{
            chap2 = 0
            await tUtils.setChap2(textUUID, 0)
        }
        dt_chap += '-' + ('000' + chap2).slice(-3)

        const dt_title = await tUtils.getDtTitle(textUUID)
        const dt_nick = await mUtils.getNick(id)
        const dt = (dt_title + dt_chap + dt_nick).toUpperCase()

        const dtExist = await tUtils.dtExist(dt, id, textUUID)
        if(dtExist){
            errorMes += "le dt_titre, et les deux chapitres sont identiques à une de tes oeuvre déjà postée ! Si tu le souhaites tu peux l'éditer au lieu de la reposter :D"
        }else{
            await tUtils.setDt(textUUID, dt)
        }

        if(errorMes !== ''){
            errorMes += "\n__appuis sur le bouton__  ↓↓↓"
            const button = require("../buttons/textModal2").get(textUUID, textUUID, PostProcess)
            await mes.interError(inter, errorMes, 0, [button])
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

            pdf.rename(file, dt)

            const spaceEmbed = new EmbedBuilder()
                .setColor(0x2C2F33)
                .setTitle('.\n.\n.')

            const textEmbed = mesUtils.newEmbed()
                .setTitle(title)
                .setAuthor({
                    name: dt + ' | '+ words + ' mots',
                    iconURL: member.displayAvatarURL(),
                    url: "https://www.youtube.com/watch?v=zRs58D34OLY" })
                .setDescription(`${desc} \n\n ||[${textUUID}](${fileMes.url})||`)

            const safeEmbed = mes.newEmbed()
                .setTitle(textUUID)
                .setDescription(`${member}\n ${dt}`)

            await mes.editMes(config.channels.safe, fileId, { files: [file], embeds: [safeEmbed] })

            const delButton = require('../buttons/textDelete').get(textUUID)
            const editButton = require('../buttons/textEdit').get(textUUID)

            let getButton
            if(password === ''){
                getButton = require('../buttons/textGet').get(textUUID)
            }else{
                getButton = require('../buttons/textPassword').get(textUUID)
            }

            const postIds = await this.forumPost(dt, member, {embeds: [textEmbed]}, themes)

            const postLinkButton = new ButtonBuilder()
                .setLabel('Avis')
                .setURL(postIds[2])
                .setStyle('Link')

            const buttons = new ActionRowBuilder().setComponents(getButton, postLinkButton, editButton, delButton)
            let textMes = await mes.sendMes(config.channels.text, { embeds: [spaceEmbed, textEmbed], components: [buttons]})

            const textLinkButton = new ButtonBuilder()
                .setLabel('Lien')
                .setURL(textMes.url)
                .setStyle('Link')
            const postButtons = new ActionRowBuilder().setComponents(getButton, textLinkButton, editButton, delButton)
            await mes.editMes(postIds[0], postIds[1], {components: [postButtons]})

            const safeButtons = new ActionRowBuilder().setComponents(textLinkButton, postLinkButton, editButton, delButton)
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

            await mes.interSuccess(inter, null, null, null, true)

        }else{
            if(oldDt !== dt || oldDesc !== desc || title !== oldTitle){
                const mesId1 = await tUtils.getTextMesId(textUUID)
                const postChannelId = await tUtils.getPostMesId(textUUID)
                const postMes = await tUtils.getPostId(textUUID)
                let textMes = await mes.getMes(config.channels.text, mesId1)
                let embed = textMes.embeds[1]

                if(oldDt !== dt && !dtExist){
                    const postChannel = await client.channels.fetch(postChannelId)
                    postChannel.setName(dt + " | <@" + id + ">")

                    const author = embed.author.name
                    const words = author.split('|')[1]
                    embed.data.author.name = dt + " | " + words

                    const safeMesId = await tUtils.getFileMesId(textUUID)
                    const safeMes = await mes.getMes(config.channels.safe, safeMesId)

                    const file = safeMes.attachments.first()
                    pdf.rename(file, dt)

                    const safeEmbed = safeMes.embeds[0]
                    const safeEmbedDesc = safeEmbed.description
                    safeEmbed.data.description = safeEmbedDesc.split("\n")[0] + "\n" + dt

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
                await mes.editMes(postChannelId, postMes, { embeds: [embed] })

            }

            if(errorMes === ''){ await mes.interSuccess(inter) }

        }

    },

    async get(textUUID, textModelUUID, postProcess){
        const modal = new ModalBuilder()
            .setCustomId(this.name + "/" + textUUID + "/" + textModelUUID + "/" + postProcess)
            .setTitle('Formulaire de post du texte :')

        let comp = []

        const title =
            new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Le titre en entier (autorisés: a-z) :')
                .setMaxLength(64)
                .setStyle('Short')
                .setRequired(true)

        const chap1 =
            new TextInputBuilder()
                .setCustomId('chap1')
                .setLabel('Premier chapitre d~où commence l~extrait :')
                .setMaxLength(3)
                .setStyle('Short')
                .setRequired(true)


        const chap2 =
            new TextInputBuilder()
                .setCustomId('chap2')
                .setLabel('Dernier chapitre (facultatif) :')
                .setMaxLength(3)
                .setStyle('Short')
                .setRequired(false)

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

            let chap2Value = await tUtils.getChap2(textModelUUID)
            if(chap2Value !== 0){
                if(textModelUUID !== textUUID){ chap2Value ++ }
                chap2.setValue(chap2Value.toString())
            }

            title.setValue(await tUtils.getTitle(textModelUUID))
            chap1.setValue(chap1Value.toString())
            desc.setValue(await tUtils.getDesc(textModelUUID))

        }

        comp = [title, chap1, chap2, desc]
        comp.forEach(c => {

            modal.addComponents(
                new ActionRowBuilder()
                    .addComponents(c)

            )

        })
        
        return modal

    },

    async forumPost(dt, user, message, themes){
        themes = tUtils.getThemesIdsByNames(themes)

        const forum = await client.channels.fetch(config.channels.opinions)

        let post =  await new GuildForumThreadManager(forum).create({
            name: `${dt}  | ${user}`,
            message: message,
            reason: "Create textPost for uuid",
            appliedTags: themes
        })

        const postId = post.id
        post = await client.channels.fetch(postId)
        const mes = await post.messages.fetch({ limit: 1 })
        const mesId = mes.last().id
        const mesUrl = mes.last().url

        return [postId, mesId, mesUrl]

    }

}