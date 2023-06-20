import { DataTypes } from "sequelize"
import { client } from "../.."
import { newEmbed, sendMes } from "../../utils/message"
import { Item } from "../Item"
import { ParameterId, parameter } from "./ParameterId"

export  class Opinion extends Item{
    id: string
    textId: string
    words: number
    messageId: string
    senderId: string
    validate: string

    constructor(id=null) {
        super(id)
    }

    static tab = this.db.define('opinions', {
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

    async setValidate(validate): Promise<void>{
        this.setAtr("validate", validate)
    }

    async getWords(): Promise<number>{
        return this.getAtr("words")
    }

    async getTextUUID(): Promise<string>{
        return this.getAtr("textId")
    }

    async getSenderId(): Promise<string>{
        return this.getAtr("senderId")
    }

    /**
     * is executed when a moderator valids a members's opinion. It hads plumes to the member, 
     * @param member the opinion's author
     * @param p the opinion's plumes number
     * @param textUUID the text which the opinion deals with
     * @param who validates the opinion
     * @param inter discord button's interaction
     * @returns the message sent to confirm the validation
     */
    async validation(member, p, textUUID, who, inter): Promise<void>{
        await member.addPlumes(p)
        const plumes = await member.getPlumes()

        let embed = newEmbed()
            .setDescription(`**${member} Possède maintenant *${plumes}*  ${c.emotes.plume}**\n\n ${p} plumes par ${who}\n\n ||${textUUID}||`)

        require('../utils/somes').plumesRolesSet(member, plumes, inter)

        require('../utils/leaderboard.js').edit()

        //increment global server plumes counter (server top channel)
        const counter = await client.channels.fetch(c.channels.counter)
        counter.setName("PLUMES : " + await new ParameterId(parameter.plumesTotal).incrementAtr("paramId", p))

        //increment global weekly plumes counter (in both cache and db)  for server global special gifts/activities
        await new ParameterId(parameter.weeklyPlumes).incrementAtr("paramId", p)
        require("../config").c.weeklyWords += p

        return await sendMes(c.channels.plumes, { embeds: [embed] })
    }

    async memberOpinionExist(textUUID, id): Promise<boolean>{
        return this.tab.count({ where: { textId: textUUID, senderId: id } })
            .then(count => {
                return count !== 0

            })

    }

}