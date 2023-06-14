
import {Tab, db} from "../dbManager"
import {DataTypes, Op} from "sequelize"
import {c} from "../config"
import {client} from "../index";
import {Member} from "./Member";
import { Embed, Message } from "discord.js";

/**
 * an extract link to a text and containing some chapters
 */
export class Extract extends Tab{

    /**
     * 
     * @param id extract uuid
     */
    constructor(id=null) {
        super(id)
    }

    /**
     * database extracts tab
     */
    static tab = db.define('extracts', {
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

    /**
     * create an extract inside database tab 
     * @param extract
     */
    async add(extract): Promise<void> {
        await this.create(extract)
    }

    /**
     * close forum channel and everything like erase datas, file etc
     */
    async vanish(): Promise<void>{
        //remove extract file on the discord server
        await this.removeFileMes()

        const postId = await this.getPostId()
        const postMesId =  await this.getPostMesId()

        //forbid any button action (edit, post_close, etc) after extract deletion
        await mes.editMes(postId, postMesId, {components: []})

        //lock forum post channel
        let channel = await client.channels.fetch(postId)
        setTimeout(() => {
            channel.setLocked(true, "Extract deleted")
        }, 4000)

        //remove all datas in db
        const authorId = await this.getAtr('authorId')
        await new Member(authorId).removeExtractId(this.id)

        await this.destroy()
    }

    async getId_extract(): Promise<string>{
        return this.getAtr('id_extract')
    }

    async setId_extract(id_extract): Promise<void>{
        await this.setAtr('id_extract', id_extract)
    }

    async getIdTitle(id): Promise<string>{
        return this.getAtr('id_extract_title')
    }

    async setIdTitle(id_extractTitle): Promise<void>{
        await this.setAtr('id_extract_title', id_extractTitle)
    }

    async getTitle(): Promise<string>{
        return this.getAtr('title')
    }

    async setTitle(title): Promise<void>{
        await this.setAtr('title', title)
    }

    async getDesc(): Promise<string>{
        return this.getAtr('desc')
    }

    async setDesc(desc): Promise<void>{
        await this.setAtr('desc', desc)
    }

    async getAuthorId(): Promise<string>{
        return this.getAtr('authorId')
    }

    async setAuthorId(authorId): Promise<void>{
        await this.setAtr('authorId', authorId)
    }

    async getChap1(): Promise<number>{
        return this.getAtr('chap1')
    }

    async setChap1(chap1): Promise<void>{
        await this.setAtr('chap1', chap1)
    }

    async getChap2(): Promise<number>{
        return this.getAtr('chap2')
    }

    async setChap2(chap2): Promise<void>{
        await this.setAtr('chap2', chap2)
    }

    async getWords(): Promise<number>{
        return this.getAtr('words')
    }

    async setWords(words): Promise<void>{
        await this.setAtr('words', words)
    }

    async setProtected(isProtected): Promise<void>{
        await this.setAtr('protected', isProtected)

    }

    async isProtected(): Promise<Boolean>{
        return this.getAtr('protected')
    }

    async getMesId(): Promise<string>{
        return this.getAtr('extractMesId')
    }

    async setMesId(extractMesId): Promise<void>{
        await this.setAtr('extractMesId', extractMesId)
    }

    async getFileMesId(): Promise<string>{
        return this.getAtr('fileMesId')
    }

    async getFileMes(): Promise<Message>{
        return await mes.getMes(c.channels.safe, await this.getFileMesId())
    }

    async setFileMesId(fileMes): Promise<void>{
        await this.setAtr('fileMesId', fileMes)
    }

    async setPostId(postId): Promise<void>{
        await this.setAtr('postId', postId)
    }

    async getPostId(): Promise<string>{
        return this.getAtr('postId')
    }

    async setPostMesId(postMesId): Promise<void>{
        await this.setAtr('postMesId', postMesId)
    }

    async getPostMesId(): Promise<string>{
        return this.getAtr('postMesId')
    }

    async getDate(): Promise<Date>{
        return this.getAtr('date')
    }

    async setDate(date): Promise<void>{
        await this.setAtr('date', date)
    }

    async getThemes(): Promise<Array<string>>{
        return this.getAtr('themes')
    }

    async setThemes(themes): Promise<void>{
        await this.setAtr('themes', themes)
    }

    async getQuestions(): Promise<Array<string>>{
        return this.getAtr('questions')
    }

    async setQuestions(questions): Promise<void>{
        await this.setAtr('questions', questions)
    }

    async removeFileMes(): Promise<void>{
        await mes.delMes(c.channels.safe, await this.getFileMesId())
    }

    /**
     * 
     * @param member the member who asked the file
     * @returns 
     */
    async sendFile(member): Promise<Message>{
        const message = await mes.getMes(c.channels.safe, await this.getFileMesId())
        const file = message.attachments.first()
        const authorId = await this.getAuthorId()
        const author = await client.users.fetch(authorId)

        const embed = mes.newEmbed()
            .setTitle("Voici le extracte demandé !")
            .setDescription(`Les bannissements et poursuites judiciaires sont éprouvants pour tout le monde... Alors ne diffuse pas cette oeuvre et prends en soin, ${author.username} compte sur toi :) \n\n || ${this.id} ||`)

        return await mes.privateMes(member, { embeds: [embed], files: [file] })
    }

    buildQuestionsEmbed(questions): Promise<Embed>{
        let desc = ''
        questions.forEach(q => {
            desc += q + '\n\n'
        })

        return mes.newEmbed()
            .setTitle("Répondez aux questions de l'auteur :")
            .setDescription(desc)
    }

    /**
     * 
     * @param id_extract_title 
     * @param id 
     * @param uuid 
     * @returns 
     * @deprecated
     */
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

    
    static async getIdByPostId(postId: string): Promise<string>{
        const uuid = await this.tab.findOne({
            where: { postId: postId },
            attributes: ['id'],
            raw: true})

        return uuid?.id
    }

    getThemesIdsByNames(themes): Array<string>{
        let themesIds: Array<string>

        for(const t of c.themes){
            if(themes.includes(t.name)){
                themesIds.push(t.id)
            }
        }

        return themesIds

    }

}