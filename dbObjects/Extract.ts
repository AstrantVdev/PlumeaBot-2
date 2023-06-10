
import {Tab, db} from "../dbManager"
import {DataTypes, Op} from "sequelize"
import {c} from "../config"
import {client} from "../index";
import {Member} from "./Member";

export class Extract extends Tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('extracts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
        },
        textId: {
            type: DataTypes.UUID
        },
        desc: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        authorId: {
            type: DataTypes.STRING,
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

    async add(extract) {
        await this.create(extract)
    }

    async vanish(){
        await this.removeExtractMes()
        await this.removeFileMes()

        const postId = await this.getPostId()
        const postMesId =  await this.getPostMesId()

        await mes.editMes(postId, postMesId, {components: []})

        let channel = await client.channels.fetch(postId)
        setTimeout(() => {
            channel.setLocked(true, "Extract deleted")
        }, 4000)

        const authorId = await this.getAtr('authorId')
        await new Member(authorId).removeExtractId(this.id)

        await this.destroy()
    }

    async getId_extract(){
        return this.getAtr('id_extract')
    }

    async setId_extract(id_extract){
        await this.setAtr('id_extract', id_extract)
    }

    async getIdTitle(id){
        return this.getAtr('id_extract_title')
    }

    async setIdTitle(id_extractTitle){
        await this.setAtr('id_extract_title', id_extractTitle)
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

    async getMesId(){
        return this.getAtr('extractMesId')
    }

    async setMesId(extractMesId){
        await this.setAtr('extractMesId', extractMesId)
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

    async removeExtractMes(){
        await mes.delMes(c.channels.text, await this.getextractMesId())
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
            .setTitle("Voici le extracte demandé !")
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

    async getSimilarExtractUUID(id_extract_title, id, uuid){
        const serie = await this.tab.findAll({
            where: {'id_extract_title': id_extract_title, 'authorId': id, 'id': { [Op.not]: uuid }},
            attributes: ['id', 'chap1', 'chap2'],
            raw: true
        })

        let max = 0
        if(serie.length !== 0){

            let extract = serie[0]
            for(let t of serie){
                if(t.chap1 > max){
                    max = t.chap1
                    extract = t
                }else if(t.chap2 > max) {
                    max = t.chap2
                    extract = t
                }

            }
            return extract.id

        }else{
            return 0

        }

    }

    async getIdByPostId(postId){
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