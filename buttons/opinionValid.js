const { ButtonBuilder, ActionRowBuilder} = require('discord.js')
const oUtils = require("../utils/opinion")
const mes = require("../utils/message")
const tUtils = require("../utils/text")
const somes = require("../utils/somes");
const {config} = require("../config");

module.exports = {
    name: 'opinionValid',

    async execute(inter){
        const member = inter.member
        const uuid = inter.customId.split('/')[1]
        const id = inter.member.id
        const senderId = await oUtils.getSenderId(uuid)

        if(! await somes.memberCheckRoles(member, [config.roles.guard, config.roles.staff])){
            await mes.interError(inter, "Tu fais quoi là -_-")
            return
        }

        await oUtils.setValidate(uuid, id)

        await inter.message.edit({ components: [] })

        const embed = mes.newEmbed()
            .setDescription("Bravo ! Ton commentaire a été validé ! :D")

        const p = await oUtils.getWords(uuid)
        const textUUID = await oUtils.getTextUUID(uuid)
        const fileMes = await tUtils.getFileMes(textUUID)

        const message = await oUtils.confirm(await inter.guild.members.fetch(senderId), p, `[${textUUID}](${fileMes.url})`, member, inter)

        const button = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setLabel("Lien")
                    .setStyle('Link')
                    .setURL(message.url))


        await mes.interSuccess(inter, { content: `<@${senderId}>`, embeds: [embed], components: [button], formatted: true})

        const opinionButton = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setLabel("Avis")
                    .setStyle('Link')
                    .setURL(inter.message.url))

        message.edit({ components: [opinionButton] })

    },

    get(uuid, row){
        const button = new ButtonBuilder()
            .setCustomId(this.name + "/" + uuid)
            .setLabel('Valider')
            .setStyle('Success')

        if(row){
            return new ActionRowBuilder()
                .setComponents(button)
        }
        return button

    }

}