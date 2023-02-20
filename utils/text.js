const mes = require('../utils/message')
const { config } = require('../config')
const db = require("../dbObjects")
const { Op } = require("sequelize")
const m = require("./member");

module.exports = {

    async get(id){
        return db.tabGet(T_TAB, id)
    },

    async addText(text){
        await db.tabCreate(T_TAB, text)
    },

    async exist(id){
        return db.tabExist(T_TAB, id)
    },

    async dtExist(dt, authorId, uuid){

        return T_TAB.count({ where: { dt: dt, authorId: authorId, id: { [Op.not]: uuid } } })
            .then(count => {
                return count !== 0

            })
    },

    async remove(id){
        await db.tabDestroy(T_TAB, id)
    },

    async vanish(id){
        await this.removeTextMes(id)
        await this.removeFileMes(id)

        const postId = await this.getPostId(id)
        const postMesId =  await this.getPostMesId(id)

        await mes.editMes(postId, postMesId, {components: []})

        let channel = await client.channels.fetch(postId)
        setTimeout(() => {
            channel.setLocked(true, "Text deleted")
        }, 4000)

        const m = require('../utils/member')
        const authorId = await db.tabGetAtr(T_TAB, id, 'authorId')
        await m.removeTextUUID(authorId, id)

        await db.tabDestroy(T_TAB, id)
    },

    async getDt(id){
        return db.tabGetAtr(T_TAB, id, 'dt')
    },

    async setDt(id, dt){
        await db.tabSetAtr(T_TAB, id, 'dt', dt)
    },

    async getDtTitle(id){
        return db.tabGetAtr(T_TAB, id, 'dt_title')
    },

    async setDtTitle(id, dtTitle){
        await db.tabSetAtr(T_TAB, id, 'dt_title', dtTitle)
    },

    async getTitle(id){
        return db.tabGetAtr(T_TAB, id, 'title')
    },

    async setTitle(id, title){
        await db.tabSetAtr(T_TAB, id, 'title', title)
    },

    async getDesc(id){
        return db.tabGetAtr(T_TAB, id, 'desc')
    },

    async setDesc(id, desc){
        await db.tabSetAtr(T_TAB, id, 'desc', desc)
    },

    async getAuthorId(id){
        return db.tabGetAtr(T_TAB, id, 'authorId')
    },

    async setAuthorId(id, authorId){
        await db.tabGetAtr(T_TAB, id, 'authorId', authorId)
    },

    async getChap1(id){
        return db.tabGetAtr(T_TAB, id, 'chap1')
    },

    async setChap1(id, chap1){
        await db.tabSetAtr(T_TAB, id, 'chap1', chap1)
    },

    async getChap2(id){
        return db.tabGetAtr(T_TAB, id, 'chap2')
    },

    async setChap2(id, chap2){
        await db.tabSetAtr(T_TAB, id, 'chap2', chap2)
    },

    async getWords(id){
        return db.tabGetAtr(T_TAB, id, 'words')
    },

    async setWords(id, words){
        await db.tabSetAtr(T_TAB, id, 'words', words)
    },

    async getTextMesId(id){
        return db.tabGetAtr(T_TAB, id, 'textMesId')
    },

    async setTextMesId(id, textMesId){
        await db.tabSetAtr(T_TAB, id, 'textMesId', textMesId)
    },

    async getFileMesId(id){
        return db.tabGetAtr(T_TAB, id, 'fileMesId')
    },

    async getFileMes(id){
        return await mes.getMes(config.channels.safe, await this.getFileMesId(id))
    },

    async setFileMesId(id, fileMes){
        await db.tabSetAtr(T_TAB, id, 'fileMesId', fileMes)
    },

    async setPostId(id, postId){
        await db.tabSetAtr(T_TAB, id, 'postId', postId)
    },

    async getPostId(id){
        return db.tabGetAtr(T_TAB, id, 'postId')
    },

    async setPostMesId(id, postMesId){
        await db.tabSetAtr(T_TAB, id, 'postMesId', postMesId)
    },

    async getPostMesId(id){
        return db.tabGetAtr(T_TAB, id, 'postMesId')
    },

    async getDate(id){
        return db.tabGetAtr(T_TAB, id, 'date')
    },

    async setDate(id, date){
        await db.tabSetAtr(T_TAB, id, 'date', date)
    },

    async getPassword(id){
        return db.tabGetAtr(T_TAB, id, 'password')
    },

    async setPassword(id, password){
        await db.tabSetAtr(T_TAB, id, 'password', password)
    },

    async getThemes(id){
        return db.tabGetAtr(T_TAB, id, 'themes')
    },

    async setThemes(id, themes){
        await db.tabSetAtr(T_TAB, id, 'themes', themes)
    },

    async getQuestions(id){
        return db.tabGetAtr(T_TAB, id, 'questions')
    },

    async setQuestions(id, questions){
        await db.tabSetAtr(T_TAB, id, 'questions', questions)
    },

    async removeTextMes(id){
        await mes.delMes(config.channels.text, await this.getTextMesId(id))
    },

    async removeFileMes(id){
        await mes.delMes(config.channels.safe, await this.getFileMesId(id))
    },

    async sendFile(id, member){
        const message = await mes.getMes(config.channels.safe, await this.getFileMesId(id))
        const file = message.attachments.first()
        const authorId = await this.getAuthorId(id)
        const author = await client.users.fetch(authorId)

        const embed = mes.newEmbed()
            .setTitle("Voici le texte demandé !")
            .setDescription(`Les bannissements et poursuites judiciaires sont éprouvants pour tout le monde... Alors ne diffuse pas cette oeuvre et prends en soin, ${author.username} compte sur toi :) \n\n || ${id} ||`)

        return await mes.private(member, { embeds: [embed], files: [file] })

    },

    async sendPostTutorial(){
        const { ButtonBuilder, ActionRowBuilder } = require('discord.js')

        const postButton = mes.getLinkButton(
            config.messages.tutoPost,
            'Comment poster son texte ?',
            '🧭',
            true
        )

        const commentButton = mes.getLinkButton(
            config.messages.tutoComment,
            'Comment commenter un texte ?',
            '🧭',
            true
        )

        const buttonMes = { content: '|\n|\n|\n|', components: [postButton, commentButton] }

        const postMesId = await db.tabGetAtr(PIDS_TAB, 'textPostMessage', 'paramId')
        await mes.delMes(config.channels.text, postMesId)

        const message = await mes.sendMes(config.channels.text, buttonMes)
        await db.tabSetAtr(PIDS_TAB, 'textPostMessage', 'paramId', message.id)

    },

    getQuestionsEmbed(questions){
        let desc = ''
        questions.forEach(q => {
            desc += q + '\n'
        })

        return mes.newEmbed()
            .setTitle("Répondez aux questions de l'auteur :")
            .setDescription(desc)
    },

    async getSimilarTextUUID(dt_title, id, uuid){
        const serie = await T_TAB.findAll({
            where: {'dt_title': dt_title, 'authorId': id, 'id': { [Op.not]: uuid }},
            attributes: ['id', 'chap1', 'chap2'],
            raw: true
        })

        let max = 0
        if(serie.length !== 0){

            let text = serie[0]
            for(let t of serie){
                if(t.chap1 > max){
                    max = t.chap1
                    text = t
                }else if(t.chap2 > max) {
                    max = t.chap2
                    text = t
                }

            }
            return text.id

        }else{
            return 0

        }

    },

    async getTextUUIDByPostId(postId){
        const uuid = await T_TAB.findOne({
            where: { postId: postId },
            attributes: ['id'],
            raw: true})

        if(uuid !== null){
            return uuid.id
        }
        return null
    },

    getThemesIdsByNames(themes){
        let themesIds = []

        for(const t of config.themes){
            if(themes.includes(t.name)){
                themesIds.push(t.id)
            }
        }

        return themesIds

    }

}