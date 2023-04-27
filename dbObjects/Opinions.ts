import {DbObject, sequelize} from "../dbManager"
import {DataTypes} from "sequelize"

export  class Opinions extends DbObject{

    constructor(id=null) {
        super(id)
    }

    tab = sequelize.define('opinions', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true
        },
        textId: DataTypes.UUID,
        words: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        messageId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        senderId: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        validate: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        }

    })

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
            .setDescription(`**${member} Possède maintenant *${plumes}*  ${c.emotes.plume}**\n\n ${p} plumes par ${who}\n\n ||${textUUID}||`)

        require('../utils/somes').plumesRolesSet(member, plumes, inter)

        require('../utils/leaderboard.js').edit()

        const counter = await client.channels.fetch(c.channels.counter)
        await this.addPlumesTotal(p)

        await this.addWeeklyPlumes(p)
        require("../config").c.weeklyWords += p

        counter.setName("PLUMES : " + await this.getPlumesTotal())

        return await mes.sendMes(c.channels.plumes, { embeds: [embed] })

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