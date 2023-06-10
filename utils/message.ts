const { c } = require('../config')
const {ActionRowBuilder, ButtonBuilder} = require("discord.js");
import { BaseMessageOptions } from "discord.js";
import {client} from "../index"

/**
 * 
 */
export class CustomMessage implements BaseMessageOptions{

}


export const colors= {
    blue: "00112B",
    red: "D52B1E",
    yellow: "FFB612",
    green: "82BE00"
}

export function newEmbed(color = "00112B"){
    const { EmbedBuilder } = require('discord.js')

    return new EmbedBuilder()
        .setColor("0x"+color)
        .setTimestamp()
        .setFooter({ text: 'PluméaBot', iconURL: 'https://i.imgur.com/TYeapMy.png' })
}

export async function privateMes(member, mes){
    let sent = true
    await member.send(mes)
        .catch( async ()=> {
            sent = false
        })

    return sent
}

export function getLinkButton(link, label, emote = c.emotes.plume, row = false){

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

}

export async function  delMessagesBeforeOne(channel, mesId, n, safe){
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

}

export function delBulkMessages(channel, messages, safe = false){
    if(safe){

        messages.forEach(m => {
            m.delete()

        })

    }else{
        channel.bulkDelete(messages, true)

    }

}

export async function  logMes(mes, type = "Message"){
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

    const sendMes = await this.sendMes(c.channels.delete, {embeds: [embed]})
    await sendMes.reply( {
        content: content,
        files: files,
        embeds: embeds,
        components: components
    })

}

export async function  sendMes(cId, mes){

    try{
        const channel = await client.channels.fetch(cId)
        return await channel.send(mes)
    }catch(e){
        console.log(e)
        return null
    }

}

export async function  delMes(cId, mesId){
    const channel = await client.channels.fetch(cId)
    let message
    try { message = await channel.messages.fetch(mesId) } catch {}

    if(message){
        message.delete({ timeout: 1000 })
        return true

    }else{
        return false
    }

}

export async function  getMes(cId, mesId){
    try{
        const channel = await client.channels.fetch(cId)
        return await channel.messages.fetch(mesId)
    }catch(e){
        return null
    }

}

export async function   editMes(cId, mesId, mes){
    const fetchMes = await this.getMes(cId, mesId)
    if(fetchMes){
        fetchMes.edit(mes)

    }

}

export async function  interSuccess(inter, reply = null, defer = false){

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

    await this.sendMes(c.channels.logs, {embeds: [embed], files: title.files})

}

export async function updateMesComp(cId, mesId, comp, index){
    const mes = await this.getMes(cId, mesId)

    mes.components[0].components[index] = comp

    await mes.edit({ components: mes.components })

}
