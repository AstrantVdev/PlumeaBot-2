
import {Tab} from "../Tab"
import {DataTypes, Op} from "sequelize"
import {c} from "../../config"
import {client} from "../../index";
import {Member} from "./Member";
import { Embed, Message } from "discord.js";

/**
 * a text's extract object. It links to a text and contains some chapters.
 */
export class Extract extends Tab{

    /**
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

    async setId_extract(id_extract: string): Promise<void>{
        await this.setAtr('id_extract', id_extract)
    }

    async getIdTitle(): Promise<string>{
        return this.getAtr('id_extract_title')
    }

    async setIdTitle(id_extractTitle: string): Promise<void>{
        await this.setAtr('id_extract_title', id_extractTitle)
    }

    async getTitle(): Promise<string>{
        return this.getAtr('title')
    }

    async setTitle(title: string): Promise<void>{
        await this.setAtr('title', title)
    }

    async getDesc(): Promise<string>{
        return this.getAtr('desc')
    }

    async setDesc(desc: string): Promise<void>{
        await this.setAtr('desc', desc)
    }

    async getAuthorId(): Promise<string>{
        return this.getAtr('authorId')
    }

    async setAuthorId(authorId: string): Promise<void>{
        await this.setAtr('authorId', authorId)
    }

    async getChap1(): Promise<number>{
        return this.getAtr('chap1')
    }

    async setChap1(chap1: number): Promise<void>{
        await this.setAtr('chap1', chap1)
    }

    async getChap2(): Promise<number>{
        return this.getAtr('chap2')
    }

    async setChap2(chap2: number): Promise<void>{
        await this.setAtr('chap2', chap2)
    }

    async getWords(): Promise<number>{
        return this.getAtr('words')
    }

    async setWords(words: number): Promise<void>{
        await this.setAtr('words', words)
    }

    async setProtected(isProtected: boolean): Promise<void>{
        await this.setAtr('protected', isProtected)

    }

    async isProtected(): Promise<boolean>{
        return this.getAtr('protected')
    }

    async getMesId(): Promise<string>{
        return this.getAtr('extractMesId')
    }

    async setMesId(extractMesId: string): Promise<void>{
        await this.setAtr('extractMesId', extractMesId)
    }

    async getFileMesId(): Promise<string>{
        return this.getAtr('fileMesId')
    }

    async getFileMes(): Promise<Message>{
        return await mes.getMes(c.channels.safe, await this.getFileMesId())
    }

    async setFileMesId(fileMes: string): Promise<void>{
        await this.setAtr('fileMesId', fileMes)
    }

    async setPostId(postId: string): Promise<void>{
        await this.setAtr('postId', postId)
    }

    async getPostId(): Promise<string>{
        return this.getAtr('postId')
    }

    async setPostMesId(postMesId: string): Promise<void>{
        await this.setAtr('postMesId', postMesId)
    }

    async getPostMesId(): Promise<string>{
        return this.getAtr('postMesId')
    }

    async getDate(): Promise<Date>{
        return this.getAtr('date')
    }

    async setDate(date: Date): Promise<void>{
        await this.setAtr('date', date)
    }

    async getThemes(): Promise<Array<string>>{
        return this.getAtr('themes')
    }

    async setThemes(themes: Array<string>): Promise<void>{
        await this.setAtr('themes', themes)
    }

    async getQuestions(): Promise<Array<string>>{
        return this.getAtr('questions')
    }

    async setQuestions(questions: Array<string>): Promise<void>{
        await this.setAtr('questions', questions)
    }

    async removeFileMes(): Promise<void>{
        await mes.delMes(c.channels.safe, await this.getFileMesId())
    }

    /**
     * send in dm the extract file to who asked
     * @param member who asked the file
     * @returns the dm message to verify if it sent
     */
    async sendFile(member: Member): Promise<Message>{
        const message = await mes.getMes(c.channels.safe, await this.getFileMesId())
        const file = message.attachments.first()
        const authorId = await this.getAuthorId()
        const author = await client.users.fetch(authorId)

        const embed = mes.newEmbed()
            .setTitle("Voici le extracte demandé !")
            .setDescription(`Les bannissements et poursuites judiciaires sont éprouvants pour tout le monde... Alors ne diffuse pas cette oeuvre et prends en soin, ${author.username} compte sur toi :) \n\n || ${this.id} ||`)

        return await mes.privateMes(member, { embeds: [embed], files: [file] })
    }

    /**
     * create an embed with the author questions which will be parsed inside extract forum channel
     * @param questions all authors questions
     * @returns the formatted embed
     */
    buildQuestionsEmbed(questions: Array<string>): Promise<Embed>{
        let desc = ''
        questions.forEach(q => {
            desc += q + '\n\n'
        })

        return mes.newEmbed()
            .setTitle("Répondez aux questions de l'auteur :")
            .setDescription(desc)
    }

    /**
     * get all extracts with similar text uuid (to get all extracts from a sam text)
     * @param id_extract_title 
     * @param id 
     * @param uuid 
     * @returns all similar extracts Ids
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

    
    /**
     * to find an extract Id with his forum channel Id (when someone send a message etc...)
     * @param postId the forum chnnel Id
     * @returns the good extract Id if there si one and null either
     */
    static async getIdByPostId(postId: string): Promise<string>{
        const uuid = await this.tab.findOne({
            where: { postId: postId },
            attributes: ['id'],
            raw: true})

        return uuid?.id
    }

    /**
     * all themes have names and ids, this method retrieve all themes ids by their names
     * @param themes a list of themes names (not null)
     * @returns all corresponding themes' ids
     */
    getThemesIdsByNames(themes: Array<string>): Array<string>{
        let themesIds: Array<string>

        for(const t of c.themes){
            if(themes.includes(t.name)){
                themesIds.push(t.id)
            }
        }

        return themesIds

    }

}