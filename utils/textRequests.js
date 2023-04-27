const db = require("../dbObjects")
const mes = require('../utils/message')
const { c } = require("../config")
const tUtils = require("../utils/text")
const { ActionRowBuilder } = require("discord.js");
const {Op} = require("sequelize");

module.exports = {

    async addOne(mesId, senderId, textId){

        await db.tabCreate(TR_TAB, {
            mesId: mesId,
            textId: textId,
            senderId: senderId,
            date: new Date
        })

    },

    async sendMes(user, textId){
        const authorId = await tUtils.getAuthorId(textId)
        const senderId = user.id

        const embed = mes.newEmbed()
            .setTitle(await tUtils.getId_Text(textId))
            .setDescription(`<@${senderId}> | ${user.username} demande l'accès au texte`)

        const row = new ActionRowBuilder()
            .setComponents(
                require("../buttons/textRequestAccept").get(senderId, textId),
                require("../buttons/textRequestDeny").get(senderId, textId),
            )

        return await mes.sendMes(c.channels.textRequest, { content: `<@${authorId}>`, embeds: [embed], components: [row]})

    },

    async sendAccept(senderId, textId){
        const authorId = await tUtils.getAuthorId(textId)

        const embed = mes.newEmbed()
            .setTitle(await tUtils.getId_Text(textId))
            .setDescription(
                `<@${authorId}> t'as donné accès au texte mais tes mp sont fermés, ouvre les pour que le bot puisse t'envoyer le fichier ! ;-;\n` +
                "> Clic droit sur Pluméa > [Paramètres de confidentialité] > [Messages privés]\n")
            .setImage("https://cdn.discordapp.com/attachments/1075907880055742494/1077992029956608050/plumea_demo.gif")

        const row = require("../buttons/textGet").get(textId, senderId, true)
        return await mes.sendMes(c.channels.textRequest, { content: `<@${senderId}>`, embeds: [embed], components: [row]})

    },

    async getDenyMes(textId, senderId){
        const authorId = await tUtils.getAuthorId(textId)

        const embed = mes.newEmbed()
            .setTitle(await tUtils.getId_Text(textId))
            .setDescription(`<@${authorId}> ne t'as pas donné accès au fichier ;-;\nps : ouvre tes mp stp, sinon je ne peux pas t'envoyer de messages...`)

        return {content: `<@${senderId}>`, embeds: [embed]}

    },

    async sendDeny(senderId, textId){
        return await mes.sendMes(c.channels.textRequest, await this.getDenyMes(textId, senderId))

    },

    async getMemberRequestDate(senderId, textId){
        const date = await TR_TAB.findOne({ attributes:  ["date"], where: { senderId: senderId, textId: textId }, raw: true })
        if(date){
            return date.date
        }
        return null

    },

    async getTimeoutMes(textId){
        const authorId = await tUtils.getAuthorId(textId)

        const embed = mes.newEmbed()
            .setTitle(await tUtils.getId_Text(textId))
            .setDescription(`$<@${authorId}> n'as pas répondu à ta demande ;-;'\nps : ouvre tes mp stp, sinon je ne peux pas t'envoyer de messages...`)

        return {embeds: [embed]}

    },

    async sendTimeout(senderId, textId){
        return await mes.sendMes(c.channels.textRequest, await this.getTimeoutMes(textId))

    },

    async removeOne(senderId, textId){
        await TR_TAB.destroy({ where: { senderId: senderId, textId: textId } })

    },

    async exist(senderId, textId){
        return await TR_TAB.count({ where: { senderId: senderId, textId: textId } })
            .then(count => {
                return count !== 0

            })
    },

    async getMemberNumber(senderId, textId){
        return await TR_TAB.count({ where: { senderId: senderId } })
    },

    async removeMes(senderId, textId){
        const mesId = await this.getMesId(senderId, textId)
        await mes.delMes(c.channels.textRequest, mesId)
    },

    async setMesId(senderId, textId, mesId){
        await TR_TAB.update({ mesId: mesId }, { where: {senderId: senderId, textId: textId } })
    },

    async getMesId(senderId, textId){
        const a = await TR_TAB.findOne({ where: { senderId: senderId, textId: textId }, attributes: ["mesId"], raw: true })
        return a.mesId
    },

    async setDate(senderId, textId, date){
        await TR_TAB.update({ date: date }, { where: {senderId: senderId, textId: textId } })
    },

    async getDate(senderId, textId){
        const a = await TR_TAB.findOne({ where: { senderId: senderId, textId: textId }, attributes: ["date"], raw: true })
        return a.date
    },

    async setOut(senderId, textId){
        await TR_TAB.update({ state: "OUT" }, { where: {senderId: senderId, textId: textId } })

    },

    async isOut(senderId, textId){
        const a = await TR_TAB.findOne({ where: { senderId: senderId, textId: textId }, attributes: ["state"], raw: true })
        return a.state === "OUT"

    },

    async setAccepted(senderId, textId){
        await TR_TAB.update({ state: "ACCEPTED" }, { where: {senderId: senderId, textId: textId } })

    },

    async isAccepted(senderId, textId){
        const a = await TR_TAB.findOne({ where: { senderId: senderId, textId: textId }, attributes: ["state"], raw: true })
        return a.state === "ACCEPTED"

    },

    async delMes(senderId, textId){
        await mes.delMes(c.channels.textRequest, await this.getMesId(senderId, textId))
    },

    async setDenied(senderId, textId){
        await TR_TAB.update({ state: "DENIED" }, { where: {senderId: senderId, textId: textId } })

    },

    async isDenied(senderId, textId){
        const a = await TR_TAB.findOne({ where: { senderId: senderId, textId: textId }, attributes: ["state"], raw: true })
        return a.state === "DENIED"

    },

    async textRequestsCleaning(){
        let date = new Date().setDate(date.getDate() - 8)

        await TR_TAB
            .destroy({
                where: {
                    state: "OUT",
                    date: {
                        [Op.lt]: date
                    }
                }
            })

        date.setDate(date.getDate() + 6)

        const goOutMes = await TR_TAB
            .findAll(
                {
                    attributes: ["senderId", "textId"],
                    raw: true,
                    where: {
                        state: {
                            [Op.or]: ["ACCEPTED", "DENIED"]
                        },
                        date: {
                            [Op.lt]: date
                        }
                    }
                })

        if(goOutMes){
            goRemoved.forEach(async r => {
                await this.delMes(r.senderId, r.textId)
            })
        }

        const goOut = await TR_TAB
            .findAll(
                {
                    attributes: ["senderId", "textId"],
                    raw: true,
                    where: {
                        state: {
                            [Op.or]: ["WAIT"]
                        },
                        date: {
                            [Op.lt]: date
                        }
                    }
                })

        if(goOut){
            goOut.forEach(async r => {
                this.delMes(r.senderId, r.textId)
                const sent = await mes.privateMes(await client.users.fetch(r.senderId), await this.getTimeoutMes(r.textId))

                if(! sent){
                    const message = await this.sendAccept(r.senderId, r.textId)
                    await this.setMesId(r.senderId, r.textId, message.id)
                }
            })
        }

        await TR_TAB
            .update(
                { state: "OUT" },
                {
                    where: {
                        state: {
                            [Op.or]: ["ACCEPTED", "DENIED", "WAIT"]
                        },
                        date: {
                            [Op.lt]: date
                        }
                    }
                })

    },

}