// import {DataTypes} from "sequelize"
// import {ActionRowBuilder, BaseMessageOptions, Message} from "discord.js"
// import { Item } from "../Item"
// import { Sprinter } from "./Spinter"

// export class Sprint extends Item{
//     id: string
//     endDate: Date
//     beginDate: Date
//     sprintersIds: string[]
//     messageId: string
//     waitingTime: number= 5
//     time: number
//     state: string

//     constructor(id=null) {
//         super(id)
//     }

//     static tab = this.db.define('sprints', {
//         id: {
//             type: DataTypes.UUID,
//             primaryKey: true,
//             unique: true
//         },
//         endDate: DataTypes.DATE,
//         beginDate: DataTypes.DATE,
//         sprintersIds: {
//             type: DataTypes.ARRAY(DataTypes.STRING),
//             defaultValue: []
//         },
//         messageId: {
//             type: DataTypes.BIGINT,
//             defaultValue: 0,
//         },
//         time: DataTypes.INTEGER,
//         state: DataTypes.STRING
//     })

//     async getEndDate(): Promise<Date>{
//         return this.getAtr('endDate')
//     }

//     async setEnd(end): Promise<void>{
//         return db.tabSetAtr('end', end)
//     }

//     async getWaitEnd(): Promise<Date>{
//         return db.tabGetAtr('waitEnd')
//     }

//     async setWaitEnd(waitEnd): Promise<void>{
//         return db.tabSetAtr('waitEnd', waitEnd)
//     }

//     async getSprinterWords(sprinterId): Promise<number>{
//         const sprinters = await this.getSprinters()
//         sprinters.filter(s => s.split("/")[0] === sprinterId)

//         return parseInt(sprinters[0].split("/")[1])
//     }

//     async addSprinter(sprinterId, words): Promise<void>{
//         await db.tabAddAtr('sprinters', sprinterId + "/" + words)
//     }

//     async removeSprinter(id, sprinterId): Promise<void>{
//         const sprinters = await this.getSprinters()
//         await db.tabSetAtr('sprinters', sprinters.filter(s => { s.split("/")[0] !== sprinterId }))
//     }

//     async removeAllSprinters(): Promise<void>{
//         await db.tabSetAtr('sprinters', [])
//     }

//     async getSprintersIds(): Promise<void>{
//         const sprinters = await this.getSprinters()

//         return sprinters.map(s => {
//             return s.split("/")[0]
//         })

//     }

//     getSprintersIds(): Promise<string[]>{
//         return db.tabGetAtr('sprintersIds')
//     }

//     async isSprinter(): Promise<boolean>{
//         const sprinters = await this.getSprintersIds()
//         return sprinters.includes()
//     }

//     async getMessageId(): Promise<string>{
//         return db.tabGetAtr('messageId')
//     }

//     async setMessageId(mesId): Promise<void>{
//         await db.tabSetAtr('messageId', mesId)
//     }

//     async isChannel(): Promise<boolean>{
//         return c.channels.sprint === this.id
//     }

//     async getTime(): Promise<number>{
//         return db.tabGetAtr("time")
//     }

//     async setTime(time): Promise<void>{
//         await db.tabSetAtr("time", time)
//     }

//     async getRunningMessageDesc(): Promise<object>{
//         const sprinters = await this.getSprinters()
//         let desc = '\n__**Participants :**__\n\n'

//         sprinters.forEach(s => {
//             const split = s.split("/")
//             desc += `<@${split[0]}> : \`${split[1]} mots\`\n`
//         })
//         return desc
//     }

//     async updateRunningMessageDesc(): Promise<void>{
//         const mesId = await this.getMessageId()
//         const message = await mes.getMes(c.channels.sprint, mesId)
//         let embed = message.embeds[0]

//         embed.data.description = await this.getRunningMessageDesc()

//         await mes.editMes(c.channels.sprint, mesId, { embeds: [embed] })

//     }

//     async beginMessageGet(date, inter): Promise<BaseMessageOptions>{
//         date = ((date.getTime() / 1000).toFixed(0))

//         let embed = mes.newEmbed()
//             .setTitle(`Le sprint commence à <t:${date}:T> <t:${date}:R> :D`)
//             .setDescription(await this.getRunningMessageDesc())

//         const jButton = require('../buttons/sprintJoin').get()
//         const lButton = require("../buttons/sprintLeave").get()

//         return { content: '', embeds: [embed], components: [ new ActionRowBuilder().setComponents(jButton, lButton) ] }

//     }

//     async goMessageSend(): Promise<void>{
//         const mesId = await this.getMessageId()

//         let description = ''

//         const sprinters = await this.getSprintersIds()

//         sprinters.forEach(s => {
//             description += '<@'+s[0]+'>\n'
//         })

//         const message = await mes.getMes(c.channels.sprint, mesId)
//         let embed = message.embeds[0]

//         let date = await this.getEnd()
//         date = (date.getTime() / 1000).toFixed(0)
//         embed.data.title = `Le sprint se termine à <t:${date}:T> <t:${date}:R> :D`

//         const newMes = await mes.sendMes(c.channels.sprint, { embeds: [embed], components: message.components })

//         await this.setMessageId(newMes.id)
//         message.delete()

//     }

//     async endMessageSend(): Promise<void>{
//         const cId = c.channels.sprint

//         const mesId = await this.getMessageId()
//         const message = await mes.getMes(cId, mesId)
//         await message.delete()

//         const sprinters = await this.getSprinters()
//         sprinters.forEach(async s =>{
//             await mes.sendMes(cId, '<@'+s.split("/")[0]+'>')
//         })

//         const embed = mes.newEmbed()
//             .setTitle(('LE SPRINT EST TERMINE ! BRAVO A TOUS :D'))

//         return await mes.sendMes(cId, {
//             embeds:[embed], components: [require('../buttons/sprintFinal').get()]
//         })

//     }

//     async endMessageUpdate(sprinter: Sprinter): Promise<void>{
//         const cId = c.channels.sprint
//         const mesId = await this.getMessageId()

//         const time = await this.getTime()

//         const message = await mes.getMes(cId, mesId)
//         let embed = message.embeds[0]
//         let desc = embed.description
//         if(! desc) desc= ''
//         sprinter
//         const difWords = sprinter.endWords - sprinter.beginWords
//         desc += `<@+${sprinter.id}> : \` ${difWords} mots | ${Math.floor(difWords/time)} \`\n`

//         embed = mes.newEmbed()
//             .setTitle(('LE SPRINT EST TERMINE ! BRAVO A TOUS :D'))
//             .setDescription(desc)

//         await mes.editMes(cId, mesId, { embeds:[embed] })

//     }




//     async removeMessageButtons(): Promise<void>{
//         await mes.editMes(c.channels.sprint, await this.getMessageId(), { components:[] })
//     }




//     async SETUP(inter): Promise<void>{
//         await this.removeMessageButtons()

//         await this.setTime(this/60)

//         let date = new Date
//         date.setSeconds(date.getSeconds() + wait)
//         await this.setWaitEnd(date)

//         const message = await mes.sendMes(c.channels.sprint, await this.beginMessageGet(date, inter))

//         await this.setMessageId(message.id)

//         await this.removeAllSprinters()
//         await this.addSprinter(inter.member.id, words)

//         date.setSeconds(date.getSeconds() + duration)
//         await this.setEnd(date)

//     }

//     async BEGIN(): Promise<void>{
//         const sprint = this

//         let BEGIN = setInterval(async function() {

//             if(new Date >= await sprint.getWaitEnd()){
//                 await sprint.GO()
//                 clearInterval(BEGIN)

//             }else{
//                 const message = await mes.getMes(c.channels.sprint, await sprint.getMessageId())
//                 const newMes = await mes.sendMes(c.channels.sprint, { embeds: message.embeds, components: message.components })
//                 await message.delete()
//                 await sprint.setMessageId(newMes.id)

//             }

//         }, 60*1000)

//     }

//     async GO(): Promise<void>{
//         await this.goMessageSend()
//         const sprint = this

//         let goScope = setInterval(async function() {

//             if(new Date >= await sprint.getEnd()){
//                 await sprint.END()
//                 clearInterval(goScope)

//             }else{
//                 const message = await mes.getMes(c.channels.sprint, await sprint.getMessageId())
//                 const newMes = await mes.sendMes(c.channels.sprint, { embeds: message.embeds, components: message.components })
//                 await message.delete()
//                 await sprint.setMessageId(newMes.id)

//             }

//         }, 60*1000)

//     }

//     async END(): Promise<void>{
//         const message = await this.endMessageSend()
//         await this.setMessageId(message.id)

//     }

// }