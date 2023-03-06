const db = require("../dbObjects")
const m = require("./member");
const {config} = require("../config");
const mes = require("./message");
const somes = require("../utils/somes")
const {dirname} = require("path");

module.exports = {

    async createOne(id, words, textUUID, senderId, messageId){
        const date = new Date()

        await db.tabCreate(O_TAB, {
            id: id,
            words: words,
            textId: textUUID,
            senderId: senderId,
            date: date,
            messageId: messageId
        })

    },

    async confirm(member, p, textUUID, who, inter){
        await m.addPlumes(member.id, p)
        const plumes = await m.getPlumes(member.id)

        let embed = mes.newEmbed()
            .setDescription(`**${member} Possède maintenant *${plumes}*  ${config.emotes.plume}**\n\n ${p} plumes par ${who}\n\n ||${textUUID}||`)

        require('../utils/somes').plumesRolesSet(member, plumes, inter)

        require('../utils/leaderboard.js').edit()

        const counter = await client.channels.fetch(config.channels.counter)
        await this.addPlumesTotal(p)

        await this.addWeeklyPlumes(p)
        require("../config").config.weeklyWords += p

        counter.setName("PLUMES : " + await this.getPlumesTotal())

        return await mes.sendMes(config.channels.plumes, { embeds: [embed] })

    },

    async addPlumesTotal(plumesTotal){
        await db.tabIncrementAtr(PIDS_TAB, 'plumesTotal', 'paramId', plumesTotal)
    },

    async getPlumesTotal(){
        return db.tabGetAtr(PIDS_TAB, 'plumesTotal', 'paramId')
    },

    async resetWeeklyPlumes(){
        await db.tabSetAtr(PIDS_TAB, 'weeklyPlumes', 'paramId', 0)
    },

    async addWeeklyPlumes(weeklyPlumes){
        await db.tabIncrementAtr(PIDS_TAB, 'weeklyPlumes', 'paramId', weeklyPlumes)
    },

    async getWeeklyPlumes(){
        return db.tabGetAtr(PIDS_TAB, 'weeklyPlumes', 'paramId')
    },

    memberOpinionExist(textUUID, id){
        return O_TAB.count({ where: { textId: textUUID, senderId: id } })
            .then(count => {
                return count !== 0

            })

    },

    async delOne(id){
        await db.tabDestroy(O_TAB, id)
    },

    async setValidate(id, validate){
        await db.tabSetAtr(O_TAB, id, "validate", validate)
    },

    async getWords(id){
        return db.tabGetAtr(O_TAB, id, "words")
    },

    async getTextUUID(id){
        return db.tabGetAtr(O_TAB, id, "textId")
    },

    async getSenderId(id){
        return db.tabGetAtr(O_TAB, id, "senderId")
    }

}