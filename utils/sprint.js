const db =  require('../dbObjects')
const mes =  require('../utils/message')
const { c } = require('../config')
const {ActionRowBuilder} = require("discord.js");

module.exports = {

    exists(id){
        return db.tabExist(S_TAB, id)
    }, 

    async addOne(id){
        const sprin = {
            id: id
        }
        await db.tabCreate(S_TAB, sprin)
    },

    async getEnd(id){
        return db.tabGetAtr(S_TAB, id, 'end')

    },

    async setEnd(id, end){
        return db.tabSetAtr(S_TAB, id, 'end', end)

    },

    async getWaitEnd(id){
        return db.tabGetAtr(S_TAB, id, 'waitEnd')

    },

    async setWaitEnd(id, waitEnd){
        return db.tabSetAtr(S_TAB, id, 'waitEnd', waitEnd)

    },

    async getSprinterWords(id, sprinterId){
        const sprinters = await this.getSprinters(id)
        sprinters.filter(s => s.split("/")[0] === sprinterId)

        return parseInt(sprinters[0].split("/")[1])

    },

    async addSprinter(id, sprinterId, words){
        await db.tabAddAtr(S_TAB, id, 'sprinters', sprinterId + "/" + words)
    },

    async removeSprinter(id, sprinterId){
        const sprinters = await this.getSprinters(id)
        await db.tabSetAtr(S_TAB, id, 'sprinters', sprinters.filter(s => { s.split("/")[0] !== sprinterId }))
    },

    async removeAllSprinters(id){
        await db.tabSetAtr(S_TAB, id, 'sprinters', [])
    },

    async getSprintersIds(id){
        const sprinters = await this.getSprinters(id)

        return sprinters.map(s => {
            return s.split("/")[0]
        })
        
    },

    getSprinters(id){
        return db.tabGetAtr(S_TAB, id, 'sprinters')
    },

    async isSprinter(id){
        const sprinters = await this.getSprintersIds()
        return sprinters.includes(id)
    },

    async getMessageId(id){
        return db.tabGetAtr(S_TAB, id, 'messageId')
    },

    async setMessageId(id, mesId){
        await db.tabSetAtr(S_TAB, id, 'messageId', mesId)
    },

    async isChannel(id){
        return c.channels.sprint === id

    },

    async getTime(id){
        return db.tabGetAtr(S_TAB, id, "time")
    },

    async setTime(id, time){
        await db.tabSetAtr(S_TAB, id, "time", time)
    },

    async getRunningMessageDesc(id){
        const sprinters = await this.getSprinters(id)
        let desc = '\n__**Participants :**__\n\n'

        sprinters.forEach(s => {
            const split = s.split("/")
            desc += `<@${split[0]}> : \`${split[1]} mots\`\n`
        })
        return desc
    },

    async updateRunningMessageDesc(id){
        const mesId = await this.getMessageId(id)
        const message = await mes.getMes(c.channels.sprint, mesId)
        let embed = message.embeds[0]

        embed.data.description = await this.getRunningMessageDesc(id)

        await mes.editMes(c.channels.sprint, mesId, { embeds: [embed] })
    },

    async beginMessageGet(id, date, inter){
        date = ((date.getTime() / 1000).toFixed(0))

        let embed = mes.newEmbed()
            .setTitle(`Le sprint commence à <t:${date}:T> <t:${date}:R> :D`)
            .setDescription(await this.getRunningMessageDesc(id))

        const jButton = require('../buttons/sprintJoin').get(id)
        const lButton = require("../buttons/sprintLeave").get(id)

        return { content: '', embeds: [embed], components: [ new ActionRowBuilder().setComponents(jButton, lButton) ] }

    },
    
    async goMessageSend(id){
        const mesId = await this.getMessageId(id)

        let description = ''

        const sprinters = await this.getSprintersIds(id)

        sprinters.forEach(s => {
            description += '<@'+s[0]+'>\n'
        })

        const message = await mes.getMes(c.channels.sprint, mesId)
        let embed = message.embeds[0]

        let date = await this.getEnd(id)
        date = (date.getTime() / 1000).toFixed(0)
        embed.data.title = `Le sprint se termine à <t:${date}:T> <t:${date}:R> :D`

        const newMes = await mes.sendMes(c.channels.sprint, { embeds: [embed], components: message.components })

        await this.setMessageId(id, newMes.id)
        message.delete()

    },

    async endMessageSend(id){
        const cId = c.channels.sprint

        const mesId = await this.getMessageId(id)
        const message = await mes.getMes(cId, mesId)
        await message.delete()

        const sprinters = await this.getSprinters(id)
        sprinters.forEach(async s =>{
            await mes.sendMes(cId, '<@'+s.split("/")[0]+'>')
        })

        const embed = mes.newEmbed()
            .setTitle(('LE SPRINT EST TERMINE ! BRAVO A TOUS :D'))

        return await mes.sendMes(cId, {
            embeds:[embed], components: [require('../buttons/sprintFinal').get(id)]
        })

    },

    async endMessageUpdate(id, userId, words, beginWords){
        const cId = c.channels.sprint
        const mesId = await this.getMessageId(id)

        const time = await this.getTime(id)

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

    },


    

    async removeMessageButtons(id){
        await mes.editMes(c.channels.sprint, await this.getMessageId(id), { components:[] })
    },




    async SETUP(id, wait, duration, words, inter){
        await this.removeMessageButtons(id)

        await this.setTime(id, duration/60)

        let date = new Date
        date.setSeconds(date.getSeconds() + wait)
        await this.setWaitEnd(id, date)

        const message = await mes.sendMes(c.channels.sprint, await this.beginMessageGet(id, date, inter))

        await this.setMessageId(id, message.id)

        await this.removeAllSprinters(id)
        await this.addSprinter(0, inter.member.id, words)

        date.setSeconds(date.getSeconds() + duration)
        await this.setEnd(id, date)

    },

    async BEGIN(id){
        const sprint = this

        let BEGIN = setInterval(async function() {

            if(new Date >= await sprint.getWaitEnd(id)){
                await sprint.GO(id)
                clearInterval(BEGIN)

            }else{
                const message = await mes.getMes(c.channels.sprint, await sprint.getMessageId(id))
                const newMes = await mes.sendMes(c.channels.sprint, { embeds: message.embeds, components: message.components })
                await message.delete()
                await sprint.setMessageId(id, newMes.id)

            }

        }, 60*1000)

    },

    async GO(id){
        await this.goMessageSend(id)
        const sprint = this

        let goScope = setInterval(async function() {

            if(new Date >= await sprint.getEnd(id)){
                await sprint.END(id)
                clearInterval(goScope)

            }else{
                const message = await mes.getMes(c.channels.sprint, await sprint.getMessageId(id))
                const newMes = await mes.sendMes(c.channels.sprint, { embeds: message.embeds, components: message.components })
                await message.delete()
                await sprint.setMessageId(id, newMes.id)

            }

        }, 60*1000)

    },

    async END(id){
        const message = await this.endMessageSend(id)
        await this.setMessageId(id, message.id)

    },

}