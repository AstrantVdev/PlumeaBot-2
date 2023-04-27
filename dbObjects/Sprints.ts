import {tab, db} from "../dbManager";
import {DataTypes} from "sequelize";
import {c} from "../config";
import {ActionRowBuilder} from "discord.js";

export class Sprint extends tab{

    constructor(id=null) {
        super()
    }

    tab = db.define('sprints', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true
        },
        end: DataTypes.DATE,
        waitEnd: DataTypes.DATE,
        sprinters: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        messageId: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        time: DataTypes.INTEGER,
        state: DataTypes.STRING

    })

    async addOne(id){
        await db.tabCreate({
            id: id
        })
    }

    async getEnd(){
        return db.tabGetAtr('end')
    }

    async setEnd(end){
        return db.tabSetAtr('end', end)
    }

    async getWaitEnd(){
        return db.tabGetAtr('waitEnd')
    }

    async setWaitEnd(waitEnd){
        return db.tabSetAtr('waitEnd', waitEnd)

    }

    async getSprinterWords(sprinterId){
        const sprinters = await this.getSprinters()
        sprinters.filter(s => s.split("/")[0] === sprinterId)

        return parseInt(sprinters[0].split("/")[1])

    }

    async addSprinter(sprinterId, words){
        await db.tabAddAtr('sprinters', sprinterId + "/" + words)
    }

    async removeSprinter(id, sprinterId){
        const sprinters = await this.getSprinters()
        await db.tabSetAtr('sprinters', sprinters.filter(s => { s.split("/")[0] !== sprinterId }))
    }

    async removeAllSprinters(){
        await db.tabSetAtr('sprinters', [])
    }

    async getSprintersIds(){
        const sprinters = await this.getSprinters()

        return sprinters.map(s => {
            return s.split("/")[0]
        })

    }

    getSprinters(){
        return db.tabGetAtr('sprinters')
    }

    async isSprinter(){
        const sprinters = await this.getSprintersIds()
        return sprinters.includes()
    }

    async getMessageId(){
        return db.tabGetAtr('messageId')
    }

    async setMessageId(mesId){
        await db.tabSetAtr('messageId', mesId)
    }

    async isChannel(){
        return c.channels.sprint === this.id
    }

    async getTime(){
        return db.tabGetAtr("time")
    }

    async setTime(time){
        await db.tabSetAtr("time", time)
    }

    async getRunningMessageDesc(){
        const sprinters = await this.getSprinters()
        let desc = '\n__**Participants :**__\n\n'

        sprinters.forEach(s => {
            const split = s.split("/")
            desc += `<@${split[0]}> : \`${split[1]} mots\`\n`
        })
        return desc
    }

    async updateRunningMessageDesc(){
        const mesId = await this.getMessageId()
        const message = await mes.getMes(c.channels.sprint, mesId)
        let embed = message.embeds[0]

        embed.data.description = await this.getRunningMessageDesc()

        await mes.editMes(c.channels.sprint, mesId, { embeds: [embed] })
    }

    async beginMessageGet(date, inter){
        date = ((date.getTime() / 1000).toFixed(0))

        let embed = mes.newEmbed()
            .setTitle(`Le sprint commence à <t:${date}:T> <t:${date}:R> :D`)
            .setDescription(await this.getRunningMessageDesc())

        const jButton = require('../buttons/sprintJoin').get()
        const lButton = require("../buttons/sprintLeave").get()

        return { content: '', embeds: [embed], components: [ new ActionRowBuilder().setComponents(jButton, lButton) ] }

    }

    async goMessageSend(){
        const mesId = await this.getMessageId()

        let description = ''

        const sprinters = await this.getSprintersIds()

        sprinters.forEach(s => {
            description += '<@'+s[0]+'>\n'
        })

        const message = await mes.getMes(c.channels.sprint, mesId)
        let embed = message.embeds[0]

        let date = await this.getEnd()
        date = (date.getTime() / 1000).toFixed(0)
        embed.data.title = `Le sprint se termine à <t:${date}:T> <t:${date}:R> :D`

        const newMes = await mes.sendMes(c.channels.sprint, { embeds: [embed], components: message.components })

        await this.setMessageId(newMes.id)
        message.delete()

    }

    async endMessageSend(){
        const cId = c.channels.sprint

        const mesId = await this.getMessageId()
        const message = await mes.getMes(cId, mesId)
        await message.delete()

        const sprinters = await this.getSprinters()
        sprinters.forEach(async s =>{
            await mes.sendMes(cId, '<@'+s.split("/")[0]+'>')
        })

        const embed = mes.newEmbed()
            .setTitle(('LE SPRINT EST TERMINE ! BRAVO A TOUS :D'))

        return await mes.sendMes(cId, {
            embeds:[embed], components: [require('../buttons/sprintFinal').get()]
        })

    }

    async endMessageUpdate(id, userId, words, beginWords){
        const cId = c.channels.sprint
        const mesId = await this.getMessageId()

        const time = await this.getTime()

        const message = await mes.getMes(cId, mesId)
        let embed = message.embeds[0]
        let desc = embed.description
        if(! desc) desc= ''

        const difWords = words - beginWords
        desc += '<@'+userId+'> : `' + difWords + ' mots | ' + Math.floor(difWords/time) + " mpm`\n"

        embed = mes.newEmbed()
            .setTitle(('LE SPRINT EST TERMINE ! BRAVO A TOUS :D'))
            .setDescription(desc)

        await mes.editMes(cId, mesId, { embeds:[embed] })

    }




    async removeMessageButtons(){
        await mes.editMes(c.channels.sprint, await this.getMessageId(), { components:[] })
    }




    async SETUP(wait, duration, words, inter){
        await this.removeMessageButtons()

        await this.setTime(duration/60)

        let date = new Date
        date.setSeconds(date.getSeconds() + wait)
        await this.setWaitEnd(date)

        const message = await mes.sendMes(c.channels.sprint, await this.beginMessageGet(date, inter))

        await this.setMessageId(message.id)

        await this.removeAllSprinters()
        await this.addSprinter(inter.member.id, words)

        date.setSeconds(date.getSeconds() + duration)
        await this.setEnd(date)

    }

    async BEGIN(){
        const sprint = this

        let BEGIN = setInterval(async function() {

            if(new Date >= await sprint.getWaitEnd()){
                await sprint.GO()
                clearInterval(BEGIN)

            }else{
                const message = await mes.getMes(c.channels.sprint, await sprint.getMessageId())
                const newMes = await mes.sendMes(c.channels.sprint, { embeds: message.embeds, components: message.components })
                await message.delete()
                await sprint.setMessageId(newMes.id)

            }

        }, 60*1000)

    }

    async GO(){
        await this.goMessageSend()
        const sprint = this

        let goScope = setInterval(async function() {

            if(new Date >= await sprint.getEnd()){
                await sprint.END()
                clearInterval(goScope)

            }else{
                const message = await mes.getMes(c.channels.sprint, await sprint.getMessageId())
                const newMes = await mes.sendMes(c.channels.sprint, { embeds: message.embeds, components: message.components })
                await message.delete()
                await sprint.setMessageId(newMes.id)

            }

        }, 60*1000)

    }

    async END(){
        const message = await this.endMessageSend()
        await this.setMessageId(message.id)

    }

}