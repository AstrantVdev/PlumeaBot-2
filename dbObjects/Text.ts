
import {Tab, db} from "../dbManager"
import {DataTypes, Op} from "sequelize"

/**
 * text object from an author
 */
export class Text extends Tab{

    /**
     * 
     * @param id the text uuid
     */
    constructor(id) {
        super(id)
    }

    getTab = db.define('texts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
        },
        desc: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        authorId: {
            type: DataTypes.STRING,
            defaultValue: 0
        },
        words: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        extractIds: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        }

    })

    async getDesc(){
        return await this.getAtr("desc")
    }

    async setDesc(desc){
        await this.setAtr("desc", desc)
    }

    async getAuthorId(){
        return await this.getAtr("authorId")
    }

    async setAuthorId(authorId){
        await this.setAtr("authorId", authorId)
    }

    async getWords(){
        return await this.getAtr("words")
    }

    async setWords(words){
        await this.setAtr("words", words)
    }

    async addWords(words){
        await this.incrementAtr("words", words)
    }

    async getExtractIds(){
        return await this.getAtr("extractIds")
    }

    async setExtractIds(extractIds){
        await this.setAtr("extractIds", extractIds)
    }

    async addExtractId(extractId){
        await this.addAtr("extractIds", extractId)
    }

    async removeExtractId(extractId){
        await this.removeAtr("extractIds", extractId)
    }

}