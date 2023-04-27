import {tab, db} from "../dbManager"
import {DataTypes, Op} from "sequelize"
import {delMes, newEmbed, sendMes} from "../utils/message"
import {c} from "../config";
import {Text} from "./Texts";

export class Member extends tab{
    constructor(id=null) {
        super(id)
    }

    public tab = db.define('members', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            unique: true
        },
        nick: {
            type: DataTypes.STRING,
            defaultValue: 'o'
        },
        joinDate: DataTypes.DATE,
        textsUUIDs: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        medals: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        cards: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        plumes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        coins: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        weeklyWords: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fileInPostingMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        textInPostingUUID: DataTypes.UUID,
        tutoIds: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        }

    })

    async addOne(){
        const date = new Date()

        await this.create({
            id: this.id,
            joinDate: date
        })
    }

    async getInactivesIds(){
        const today = new Date()
        const limit = today.setDate(today.getDate() - 32)

        return db.findAll({
            where: {
                plumes: 0,
                joinDate: {
                    [Op.lt]: limit
                }
            },
            attributes: ['id'],
            raw: true
        })
    }

    async getNick(){
        return await this.getAtr('nick')
    }

    async setNick(nick){
        await this.setAtr('nick', nick)
    }

    async hasNick(){
        const nick = await this.getNick()
        return nick.length === 4
    }

    async getPlumes(){
        return this.getAtr('plumes')
    }

    async addPlumes(plumes){
        await this.incrementAtr('plumes', plumes)
    }

    async removePlumes(plumes){
        await this.incrementAtr('plumes', -plumes)
    }

    async getCoins(){
        return this.getAtr("coins")
    }

    async addCoins(coins){
        await this.incrementAtr('coins', coins)
    }

    async removeCoins(coins){
        await this.incrementAtr('coins', -coins)
    }

    async getWeeklyWords(){
        return this.getAtr('weeklyWords')
    }

    async addWeeklyWords(weeklyWords){
        await this.incrementAtr('weeklyWords', weeklyWords)
    }

    async getJoinDate(){
        return this.getAtr('joinDate')

    }

    async removeWeeklyWords(weeklyWords){
        await this.incrementAtr('weeklyWords', -weeklyWords)
    }

    async toMuchWeeklyWords(words){
        const weekly = await this.getWeeklyWords()
        return weekly + words > 16000;

    }

    async resetAllWeeklyWords(){
        await this.setAtrToAll('weeklyWords', 0)
    }

    async isFileInPosting(){
        return await this.getFileInPostingMesId() !== 0
    }

    async setFileInPostingMesId(fileInPostingMesId){
        await this.setAtr('fileInPostingMesId', fileInPostingMesId)
    }

    async getFileInPostingMesId(){
        return this.getAtr('fileInPostingMesId')
    }

    async removeFileInPostingMes(){
        await delMes(c.channels.safe, await this.getFileInPostingMesId())
    }

    async addFileInPosting(user, file){
        const embed = newEmbed()
            .setTitle("Texte en /post")
            .setDescription(`par ${user}`)

        const fileInPostingMes = await sendMes(c.channels.safe, {embeds: [embed], files: [file]})
        await this.setFileInPostingMesId(fileInPostingMes.id)

    }

    async setTextInPostingUUID(textInPostingUUID){
        await this.setAtr('textInPostingUUID', textInPostingUUID)
    }

    async getTextInPostingUUID(){
        return this.getAtr('textInPostingUUID')
    }

    async getTextInPosting(){
        const uuid = await this.getTextInPostingUUID()
        return new Text(uuid).get()
    }

    async getTextsUUIDs(){
        return await this.getAtr('textsUUIDs')
    }

    async addTextUUID(UUID){
        await this.addAtr('textsUUIDs', UUID)
    }

    async removeTextUUID(UUID){
        await this.removeAtr('textsUUIDs', UUID)
    }

    async removeAllTextsUUIDs(){
        await this.setAtr("textsUUIDs", [])
    }

    async getAllIdsPlumes(){
        return this.getMultipleAtr(['id', 'plumes'])
    }

    async hasTutoId(tutoId){
        const tutoIds = await this.getAtr('tutoIds')
        return tutoIds.includes(tutoId)

    }

    async addTutoId(tutoId){
        await this.addAtr('tutoIds', tutoId)
    }

}