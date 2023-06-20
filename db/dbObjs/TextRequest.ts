import {DataTypes, Op} from "sequelize"
import {ActionRowBuilder} from "discord.js"
import { client } from "../.."
import { Item } from "../Item"
import { Extract } from "./Extract"
import { Text } from "./Text"

export class TextRequest extends Item{
    extractId: string
    senderId: string
    date: Date
    state: string

    constructor(id=null) {
        super(id)
    }

    static tab = this.db.define('textRequest', {
        extractId: DataTypes.UUID,
        senderId: DataTypes.BIGINT,
        date: DataTypes.DATE,
        state: {
            type: DataTypes.STRING,
            defaultValue: "WAIT"
        }

    })

    /**
     * send request message in good channel
     * @param sender discord user who sent the request (to get his username easier)
     * @returns the sent message
     */
    async sendMes(sender): Promise<void>{
        const extract = new Extract(this.extractId)
        const text = new Text(await extract.getTextId())

        const embed = mes.newEmbed()
            .setTitle(await text.get())
            .setDescription(`<@${this.senderId}> | ${sender.username} demande l'accès au texte`)

        const row = new ActionRowBuilder()
            .setComponents(
                require("../buttons/textRequestAccept").get(this.senderId, text.id),
                require("../buttons/textRequestDeny").get(this.senderId, text.id),
            )

        return await mes.sendMes(c.channels.textRequest, { content: `<@${text.authorId}>`, embeds: [embed], components: [row]})

    }

    /**
     * 
     * @returns the sent message
     */
    async sendAccept(): Promise<void>{
        const extract = new Extract(this.extractId)
        const text = new Text(await extract.getTextId())

        const embed = mes.newEmbed()
            .setTitle(await extract.getId_extract())
            .setDescription(
                `<@${text.getAuthorId()}> t'as donné accès au texte mais tes mp sont fermés, ouvre les pour que le bot puisse t'envoyer le fichier ! ;-;\n` +
                "> Clic droit sur Pluméa > [Paramètres de confidentialité] > [Messages privés]\n")
            .setImage("https://cdn.discordapp.com/attachments/1075907880055742494/1077992029956608050/plumea_demo.gif")

        const row = require("../buttons/textGet").get(text.id, this.senderId, true)
        return await mes.sendMes(c.channels.textRequest, { content: `<@${this.senderId}>`, embeds: [embed], components: [row]})

    }

    async getDenyMes(textId, senderId){
        const text = new Extract(textId)
        const authorId = await text.getAuthorId()

        const embed = mes.newEmbed()
            .setTitle(await text.getId_extract())
            .setDescription(`<@${authorId}> ne t'as pas donné accès au fichier ;-;\nps : ouvre tes mp stp, sinon je ne peux pas t'envoyer de messages...`)

        return {content: `<@${senderId}>`, embeds: [embed]}

    }

    async sendDeny(senderId, textId){
        return await mes.sendMes(c.channels.textRequest, await this.getDenyMes(textId, senderId))
    }

    async getMemberRequestDate(){
        const date = this.getAtr("date")
        if(date){
            return date
        }
        return null

    }

    async setTextId(textId){
        await this.setAtr("textId", textId)
    }

    async getTextId(){
        return await this.getAtr("textId")
    }

    async getTimeoutMes(){
        const text = new Extract(this.get)
        const authorId = await text.getAuthorId()

        const embed = mes.newEmbed()
            .setTitle(await text.getId_extract())
            .setDescription(`$<@${authorId}> n'as pas répondu à ta demande ;-;'\nps : ouvre tes mp stp, sinon je ne peux pas t'envoyer de messages...`)

        return {embeds: [embed]}

    }

    async sendTimeout(){
        return await mes.sendMes(c.channels.textRequest, await this.getTimeoutMes())
    }

    async setDate(date){
        await this.setAtr("date", date)
    }

    async getDate(){
        return await this.getAtr("date")
    }

    async setOut(){
        await this.setAtr("state", "OUT")
    }

    async isOut(){
        return await this.getAtr("state") == "OUT"
    }

    async setAccepted(senderId, textId){
        await this.setAtr("state", "ACCEPTED")
    }

    async isAccepted(senderId, textId){
        return await this.getAtr("state") == "ACCEPTED"
    }

    async setDenied(senderId, textId){
        await this.setAtr("state", "DENIED")
    }

    async isDenied(senderId, textId){
        return await this.getAtr("state") == "DENIED"
    }

    async textRequestsCleaning(){
        let date = new Date()
        date.setDate(date.getDate() - 4)

        const goOut = await this.getTab
            .findAll(
                {
                    attributes: ["id", "senderId", "state"],
                    raw: true,
                    where: {
                        date: {
                            [Op.lt]: date
                        }
                    }
                })

        for (const r of goOut) {

            if(r.state == "WAIT"){
                const sent = await mes.privateMes(await client.users.fetch(r.senderId), await this.getTimeoutMes())

                if(!sent){
                    await this.sendTimeout()
                }
            }

            await new TextRequest(r.id).removeOne()
        }

    }

}