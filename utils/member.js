const db = require('../dbObjects.js')
const mes = require('../utils/message')
const { c } = require('../config')
const tUtils = require('../utils/text')
const { Op } = require("sequelize")

module.exports = {

    async getMember(id){
        await db.tabGet(M_TAB, id)
    },

    async addMember(id){
        const date = new Date()

        await db.tabCreate(M_TAB, {
            id: id,
            joinDate: date
        })
    },

    async removeMember(id){
        await db.tabDestroy(M_TAB, id)
    },

    async exists(id){
        return db.tabExist(M_TAB, id)
    },

    async getInactivesIds(){
        const today = new Date()
        const limit = today.setDate(today.getDate() - 32)

        return M_TAB.findAll({
            where: {
                plumes: 0,
                joinDate: {
                    [Op.lt]: limit
                }
            },
            attributes: ['id'],
            raw: true
        })
    },

    async getNick(id){
        return await db.tabGetAtr(M_TAB, id, 'nick')
    },

    async setNick(id, nick){
        await db.tabSetAtr(M_TAB, id, 'nick', nick)
    },

    async hasNick(id){
        const nick = await this.getNick(id)
        return nick.length === 4
    },

    async getPlumes(id){
        return db.tabGetAtr(M_TAB, id, 'plumes')
    },

    async addPlumes(id, plumes){
        await db.tabIncrementAtr(M_TAB, id, 'plumes', plumes)
    },

    async removePlumes(id, plumes){
        await db.tabIncrementAtr(M_TAB, id, 'plumes', -plumes)
    },

    async getCoins(id){
        return db.tabGetAtr(M_TAB, id, 'coins')
    },

    async addCoins(id, coins){
        await db.tabIncrementAtr(M_TAB, id, 'coins', coins)
    },

    async removeCoins(id, coins){
        await db.tabIncrementAtr(M_TAB, id, 'coins', -coins)
    },

    async getWeeklyWords(id){
        return db.tabGetAtr(M_TAB, id, 'weeklyWords')
    },

    async addWeeklyWords(id, weeklyWords){
        await db.tabIncrementAtr(M_TAB, id, 'weeklyWords', weeklyWords)
    },

    async getJoinDate(id){
        return db.tabGetAtr(M_TAB, id, 'joinDate')

    },

    async removeWeeklyWords(id, weeklyWords){
        await db.tabIncrementAtr(M_TAB, id, 'weeklyWords', -weeklyWords)
    },

    async toMuchWeeklyWords(id, words){
        const weekly = await this.getWeeklyWords(id)
        return weekly + words > 16000;

    },

    async resetAllWeeklyWords(){
        await db.tabSetAtrToAll(M_TAB, 'weeklyWords', 0)
    },

    async isFileInPosting(id){
        return await this.getFileInPostingMesId(id) !== 0
    },

    async setFileInPostingMesId(id, fileInPostingMesId){
        await db.tabSetAtr(M_TAB, id, 'fileInPostingMesId', fileInPostingMesId)
    },

    async getFileInPostingMesId(id){
        return db.tabGetAtr(M_TAB, id, 'fileInPostingMesId')
    },

    async removeFileInPostingMes(id){
        await mes.delMes(c.channels.safe, await this.getFileInPostingMesId(id))
    },

    async addFileInPosting(user, file){
        const embed = mes.newEmbed()
            .setTitle("Texte en /post")
            .setDescription(`par ${user}`)

        const fileInPostingMes = await mes.sendMes(c.channels.safe, {embeds: [embed], files: [file]})
        await this.setFileInPostingMesId(user.id, fileInPostingMes.id)

    },

    async setTextInPostingUUID(id, textInPostingUUID){
        await db.tabSetAtr(M_TAB, id, 'textInPostingUUID', textInPostingUUID)
    },

    async getTextInPostingUUID(id){
        return db.tabGetAtr(M_TAB, id, 'textInPostingUUID')
    },

    async getTextInPosting(id){
        const uuid = await this.getTextInPostingUUID(id)
        return tUtils.get(uuid)
    },

    async getTextsUUIDs(id){
        return await db.tabGetAtr(M_TAB, id, 'textsUUIDs')
    },

    async addTextUUID(id, UUID){
        await db.tabAddAtr(M_TAB, id, 'textsUUIDs', UUID)
    },

    async removeTextUUID(id, UUID){
        await db.tabRemoveAtr(M_TAB, id, 'textsUUIDs', UUID)
    },

    async removeAllTextsUUIDs(id){
        await db.tabSetAtr(M_TAB, id, "textsUUIDs", [])
    },

    async getAllIdsPlumes(){
        return db.tabGetMultipleAtr(M_TAB, null, ['id', 'plumes'])
    },

    async hasTutoId(id, tutoId){
        const tutoIds = await db.tabGetAtr(M_TAB, id, 'tutoIds')
        return tutoIds.includes(tutoId)

    },

    async addTutoId(id, tutoId){
        await db.tabAddAtr(M_TAB, id, 'tutoIds', tutoId)
    },

}