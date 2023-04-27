
import {tab, db} from "../dbManager"
import {DataTypes, Op} from "sequelize"
import {c} from "../config"
import {client} from "../index";
import {Member} from "./Member";

export class Text extends tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('texts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
        },
        id_text_title: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        id_text: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        desc: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        authorId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        chap1: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        chap2: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        words: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        textMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        fileMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        postId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        postMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        protected: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        themes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        questions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        }

    })

    async addText(text){
        await this.create(text)
    }

    async id_textExist(id_text, authorId, uuid){

        return this.tab.count({ where: { id_text: id_text, authorId: authorId, id: { [Op.not]: uuid } } })
            .then(count => {
                return count !== 0

            })
    }

    async vanish(){
        await this.removeTextMes()
        await this.removeFileMes()

        const postId = await this.getPostId()
        const postMesId =  await this.getPostMesId()

        await mes.editMes(postId, postMesId, {components: []})

        let channel = await client.channels.fetch(postId)
        setTimeout(() => {
            channel.setLocked(true, "Text deleted")
        }, 4000)

        const authorId = await this.getAtr('authorId')
        await new Member(authorId).removeTextUUID(this.id)

        await this.destroy()
    }

    async getId_Text(){
        return this.getAtr('id_text')
    }

    async setId_Text(id_text){
        await this.setAtr('id_text', id_text)
    }

    async getIdTitle(id){
        return this.getAtr('id_text_title')
    }

    async setIdTitle(id_textTitle){
        await this.setAtr('id_text_title', id_textTitle)
    }

    async getTitle(){
        return this.getAtr('title')
    }

    async setTitle(title){
        await this.setAtr('title', title)
    }

    async getDesc(){
        return this.getAtr('desc')
    }

    async setDesc(desc){
        await this.setAtr('desc', desc)
    }

    async getAuthorId(){
        return this.getAtr('authorId')
    }

    async setAuthorId(authorId){
        await this.setAtr('authorId', authorId)
    }

    async getChap1(){
        return this.getAtr('chap1')
    }

    async setChap1(chap1){
        await this.setAtr('chap1', chap1)
    }

    async getChap2(){
        return this.getAtr('chap2')
    }

    async setChap2(chap2){
        await this.setAtr('chap2', chap2)
    }

    async getWords(){
        return this.getAtr('words')
    }

    async setWords(words){
        await this.setAtr('words', words)
    }

    async setProtected(isProtected){
        await this.setAtr('protected', isProtected)

    }

    async isProtected(){
        return this.getAtr('protected')
    }

    async getTextMesId(){
        return this.getAtr('textMesId')
    }

    async setTextMesId(textMesId){
        await this.setAtr('textMesId', textMesId)
    }

    async getFileMesId(){
        return this.getAtr('fileMesId')
    }

    async getFileMes(){
        return await mes.getMes(c.channels.safe, await this.getFileMesId())
    }

    async setFileMesId(fileMes){
        await this.setAtr('fileMesId', fileMes)
    }

    async setPostId(postId){
        await this.setAtr('postId', postId)
    }

    async getPostId(){
        return this.getAtr('postId')
    }

    async setPostMesId(postMesId){
        await this.setAtr('postMesId', postMesId)
    }

    async getPostMesId(){
        return this.getAtr('postMesId')
    }

    async getDate(){
        return this.getAtr('date')
    }

    async setDate(date){
        await this.setAtr('date', date)
    }

    async getThemes(){
        return this.getAtr('themes')
    }

    async setThemes(themes){
        await this.setAtr('themes', themes)
    }

    async getQuestions(){
        return this.getAtr('questions')
    }

    async setQuestions(questions){
        await this.setAtr('questions', questions)
    }

    async removeTextMes(){
        await mes.delMes(c.channels.text, await this.getTextMesId())
    }

    async removeFileMes(){
        await mes.delMes(c.channels.safe, await this.getFileMesId())
    }

    async sendFile(member){
        const message = await mes.getMes(c.channels.safe, await this.getFileMesId())
        const file = message.attachments.first()
        const authorId = await this.getAuthorId()
        const author = await client.users.fetch(authorId)

        const embed = mes.newEmbed()
            .setTitle("Voici le texte demandé !")
            .setDescription(`Les bannissements et poursuites judiciaires sont éprouvants pour tout le monde... Alors ne diffuse pas cette oeuvre et prends en soin, ${author.username} compte sur toi :) \n\n || ${this.id} ||`)

        return await mes.privateMes(member, { embeds: [embed], files: [file] })

    }

    getQuestionsEmbed(questions){
        let desc = ''
        questions.forEach(q => {
            desc += q + '\n\n'
        })

        return mes.newEmbed()
            .setTitle("Répondez aux questions de l'auteur :")
            .setDescription(desc)
    }

    async getSimilarTextUUID(id_text_title, id, uuid){
        const serie = await this.tab.findAll({
            where: {'id_text_title': id_text_title, 'authorId': id, 'id': { [Op.not]: uuid }},
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

    }

    async getTextUUIthisyPostId(postId){
        const uuid = await this.tab.findOne({
            where: { postId: postId },
            attributes: ['id'],
            raw: true})

        if(uuid !== null){
            return uuid.id
        }
        return null
    }

    getThemesIdsByNames(themes){
        let themesIds = []

        for(const t of c.themes){
            if(themes.includes(t.name)){
                themesIds.push(t.id)
            }
        }

        return themesIds

    }

}