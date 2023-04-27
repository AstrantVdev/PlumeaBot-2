import {Tab, db} from "../dbManager"
import {DataTypes} from "sequelize"
import {parameter, ParametersIds} from "./ParametersIds"
import {client} from "../index"
import {newEmbed, sendMes} from "../utils/message"
import{c} from "../config"
export  class Opinions extends Tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('opinions', {
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
            type: DataTypes.STRING,
            defaultValue: 0,
        },
        validate: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        }

    })

    async confirm(member, p, textUUID, who, inter){
        await member.addPlumes(p)
        const plumes = await member.getPlumes()

        let embed = newEmbed()
            .setDescription(`**${member} Possède maintenant *${plumes}*  ${c.emotes.plume}**\n\n ${p} plumes par ${who}\n\n ||${textUUID}||`)

        require('../utils/somes').plumesRolesSet(member, plumes, inter)

        require('../utils/leaderboard.js').edit()

        const counter = await client.channels.fetch(c.channels.counter)
        await new ParametersIds(parameter.plumesTotal).incrementAtr(null, p)

        await new ParametersIds(parameter.weeklyPlumes).incrementAtr("paramId", p)
        require("../config").c.weeklyWords += p

        counter.setName("PLUMES : " + await new ParametersIds(parameter.plumesTotal).incrementAtr("paramId", p))

        return await sendMes(c.channels.plumes, { embeds: [embed] })

    }

    memberOpinionExist(textUUID, id){
        return this.tab.count({ where: { textId: textUUID, senderId: id } })
            .then(count => {
                return count !== 0

            })

    }

    async setValidate(validate){
        await this.setAtr("validate", validate)
    }

    async getWords(){
        return this.getAtr("words")
    }

    async getTextUUID(){
        return this.getAtr("textId")
    }

    async getSenderId(){
        return this.getAtr("senderId")
    }

}