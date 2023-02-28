const { config } = require('../config')
const {ActionRowBuilder, ButtonBuilder} = require("discord.js");

module.exports = {

    color: {
        blue: "00112B",
        red: "D52B1E",
        yellow: "FFB612",

    },

    newEmbed(color = "00112B"){
        const { EmbedBuilder } = require('discord.js')

        return new EmbedBuilder()
            .setColor("0x"+color)
            .setTimestamp()
            .setFooter({ text: 'PluméaBot', iconURL: 'https://i.imgur.com/TYeapMy.png' })
    },

    async private(member, mes){
        let sent = true
        await member.send(mes)
            .catch( async ()=> {
                sent = false
        })

        return sent
    },

    getLinkButton(link, label, emote = config.emotes.plume, row = false){

        const button = new ButtonBuilder()
            .setLabel(label)
            .setEmoji(emote)
            .setStyle('Link')
            .setURL(link)

        if(row){
            return new ActionRowBuilder()
                .setComponents(
                    button
                )
        }
        return button

    },

    async delMessagesBeforeOne(channel, mesId, n, safe){
        let option = {}

        if(mesId !== 0){
            option["before"] = mesId
        }

        while(n !== 0){
            let fetch
            if(n > 100){
                option["limit"] = 100
                fetch = await channel.messages.fetch(option)

                try{
                    mesId = fetch.last().id

                }catch (e) {
                    return false
                }

                n -= 100

            }else{
                option["limit"] = n
                fetch = await channel.messages.fetch(option)
                n = 0

            }

            this.delBulkMessages(channel, fetch, safe)

        }

        return true

    },

    delBulkMessages(channel, messages, safe = false){
        if(safe){

            messages.forEach(m => {
                m.delete()

            })

        }else{
            channel.bulkDelete(messages, true)

        }

    },

    async logMes(mes, type = "Message"){
        const channel = mes.channel
        const author = mes.author
        const time = mes.createdAt
        const unixTime = parseInt((new Date(time).getTime() / 1000).toFixed(0))

        const embed = this.newEmbed()
            .setTitle(`${type} ↓↓↓`)
            .addFields(
                {name: "Channel", value: `${channel}`, inline: true},
                {name: "Author", value: `${author}`, inline: true},
                {name: "CreatedAt", value: `<t:${unixTime}>`, inline: true},
                )

        if(type === "Updated"){
            const url = mes.url
            embed.addFields({name: "Url", value: url, inline: true})
        }

        const content = mes.content
        const files = Array.from(mes.attachments.values())
        const embeds = Array.from(mes.embeds.values())
        const components = Array.from(mes.components.values())

        const sendMes = await this.sendMes(config.channels.delete, {embeds: [embed]})
        await sendMes.reply( {
            content: content,
            files: files,
            embeds: embeds,
            components: components
        })

    },

    async sendMes(cId, mes){

        try{
            const channel = await client.channels.fetch(cId)
            const m = await channel.send(mes)
            return m
        }catch(e){
            console.log(e)
            return null
        }

    },

    async delMes(cId, mesId){
        const channel = await client.channels.fetch(cId)
        let message
        try { message = await channel.messages.fetch(mesId) } catch {}

        if(message){
            message.delete({ timeout: 1000 })
            return true

        }else{
            return false
        }

    },

    async getMes(cId, mesId){
        const channel = await client.channels.fetch(cId)
        try{
            return await channel.messages.fetch(mesId)
        }catch(e){
            return null
        }

    },

    async  editMes(cId, mesId, mes){
        const fetchMes = await this.getMes(cId, mesId)
        if(fetchMes){
            fetchMes.edit(mes)

        }

    },

    chooseInterMessageTitle(inter){
        let title = { }
        let options = []

        if(inter.isChatInputCommand()){
            title.content = '/ ' + inter.commandName
            const cmdOptions = inter._hoistedOptions

            if(cmdOptions){
                cmdOptions.forEach(o => {
                    options.push(o.value)

                    if(o.type === 11){
                        title.files.push(o.attachment)
                    }

                })

            }

        }else if(inter.isButton()){
            const split = inter.customId.split('/')
            title.content = 'o ' + split[0]
            options = split.slice(1, split.length)

        }else if(inter.isModalSubmit()){
            const split = inter.customId.split('/')
            title.content = '% ' + split[0]
            options = split.slice(1, -1)

        }else if(inter.isStringSelectMenu() || inter.isChannelSelectMenu() || inter.isMentionableSelectMenu() || inter.isRoleSelectMenu() || inter.isUserSelectMenu()){
            const split = inter.customId.split('/')
            title.content = '^ ' + split[0]
            options = split.slice(1, -1)

        }

        for(let o in options){
            title.content += "\n`" + options[o] + "`"

        }

        return title

    },

    async interSuccess(inter, reply = null, defer = false){

        if(reply){

            if(! reply.data){

                if(typeof reply === "string"){
                    const embed = this.newEmbed()
                        .setDescription(`**${reply}**`)

                    reply = { embeds: [embed], ephemeral: true }

                }else{

                    if(! reply.formatted){
                        reply.embeds = [this.newEmbed().setDescription(reply.content)]
                        reply.content = null

                    }

                    if(reply.ephemeral === undefined){
                        reply.ephemeral = true
                    }

                }

                if(defer) {
                    await inter.editReply(reply)

                }else{
                    await inter.reply(reply)
                }

            }else{
                await inter.showModal(reply)

            }

        }else{
            const embed = this.newEmbed()
                .setDescription(`**Action accomplie avec succès ! :D**`)

            if(defer) {
                await inter.editReply({ embeds: [embed], ephemeral: true } )
            }else{
                await inter.reply( { embeds: [embed], ephemeral: true } )
            }

        }


        const title = this.chooseInterMessageTitle(inter)
        const embed = this.newEmbed("82BE00")
            .setTitle(title.content)
            .setDescription(`**Success** | ${inter.member.user} | <#${inter.channel.id}>`)

        await this.sendMes(config.channels.logs, {embeds: [embed], files: title.files})

    },

    async updateMesComp(cId, mesId, comp, index){
        const mes = await this.getMes(cId, mesId)

        mes.components[0].components[index] = comp

        await mes.edit({ components: mes.components })

    },

    async interError(inter, error, level = 0, defer = false, link = null){
        let errorMes = 'Une erreur est survenue, vous pouvez contacter <@548551538487066629> pour vous aider'

        if(error){

            if(error.content){
                errorMes = error.content
            }else{
                errorMes = error

            }

        }

        let color = this.color.yellow
        if (level === 1){
            color = this.color.red
            errorMes += "Contacte <@548551538487066629>"
        }

        const embed = this.newEmbed()
            .setTitle("Error ;-;")
            .setDescription(`${errorMes}`)

        if(link){
            embed.setImage(link)
        }

        let reply = { embeds: [embed], ephemeral: true }
        if(error.components){ reply.components = error.components }

        if(defer) {
            await inter.editReply(reply)
        }else{
            await inter.reply(reply)
        }

        const title = this.chooseInterMessageTitle(inter)
        const embed2 = this.newEmbed(color)
            .setTitle(title.content)
            .setDescription(`**Error** | ${inter.member.user} | <#${inter.channel.id}>
                            \`\`\`${error}\`\`\``)

        let content = ''
        if(level === 1){ content += `<@&${config.roles.dev}>` }

        await this.sendMes(config.channels.logs, { content: content, embeds: [embed2] })

    },
    
}