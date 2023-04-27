import {DbObject, sequelize} from "../dbManager";
import {DataTypes, Op} from "sequelize";

export class Member extends DbObject{
    constructor(id=null) {
        super(id)
    }

    public tab = sequelize.define('members', {
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

        await this.tabCreate({
            id: this.id,
            joinDate: date
        })
    }

    async getInactivesIds(){
        const today = new Date()
        const limit = today.setDate(today.getDate() - 32)

        return sequelize.findAll({
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
        return await this.tabGetAtr('nick')
    }

    async setNick(nick){
        await this.tabSetAtr('nick', nick)
    }

    async hasNick(){
        const nick = await this.getNick()
        return nick.length === 4
    }

    async getPlumes(){
        return this.tabGetAtr('plumes')
    }

    async addPlumes(plumes){
        await this.tabIncrementAtr('plumes', plumes)
    }

    async removePlumes(plumes){
        await this.tabIncrementAtr('plumes', -plumes)
    }

    async getCoins(){
        return this.tabGetAtr("coins")
    }

    async addCoins(coins){
        await this.tabIncrementAtr('coins', coins)
    }

    async removeCoins(coins){
        await this.tabIncrementAtr('coins', -coins)
    }

    async getWeeklyWords(){
        return this.tabGetAtr('weeklyWords')
    }

    async addWeeklyWords(weeklyWords){
        await this.tabIncrementAtr('weeklyWords', weeklyWords)
    }

    async getJoinDate(){
        return this.tabGetAtr('joinDate')

    }

    async removeWeeklyWords(weeklyWords){
        await this.tabIncrementAtr('weeklyWords', -weeklyWords)
    }

    async toMuchWeeklyWords(words){
        const weekly = await this.getWeeklyWords()
        return weekly + words > 16000;

    }

    async resetAllWeeklyWords(){
        await this.tabSetAtrToAll('weeklyWords', 0)
    }

    async isFileInPosting(){
        return await this.getFileInPostingMesId() !== 0
    }

    async setFileInPostingMesId(fileInPostingMesId){
        await this.tabSetAtr('fileInPostingMesId', fileInPostingMesId)
    }

    async getFileInPostingMesId(){
        return this.tabGetAtr('fileInPostingMesId')
    }

    async removeFileInPostingMes(){
        await mes.delMes(c.channels.safe, await this.getFileInPostingMesId(id))
    }

    async addFileInPosting(user, file){
        const embed = mes.newEmbed()
            .setTitle("Texte en /post")
            .setDescription(`par ${user}`)

        const fileInPostingMes = await mes.sendMes(c.channels.safe, {embeds: [embed], files: [file]})
        await this.setFileInPostingMesId(user.id, fileInPostingMes.id)

    }

    async setTextInPostingUUID(textInPostingUUID){
        await this.tabSetAtr('textInPostingUUID', textInPostingUUID)
    }

    async getTextInPostingUUID(){
        return this.tabGetAtr('textInPostingUUID')
    }

    async getTextInPosting(){
        const uuid = await this.getTextInPostingUUID()
        return tUtils.get(uuid)
    }

    async getTextsUUIDs(){
        return await this.tabGetAtr('textsUUIDs')
    }

    async addTextUUID(UUID){
        await this.tabAddAtr('textsUUIDs', UUID)
    }

    async removeTextUUID(UUID){
        await this.tabRemoveAtr('textsUUIDs', UUID)
    }

    async removeAllTextsUUIDs(){
        await this.tabSetAtr("textsUUIDs", [])
    }

    async getAllIdsPlumes(){
        return this.tabGetMultipleAtr(['id', 'plumes'])
    }

    async hasTutoId(tutoId){
        const tutoIds = await this.tabGetAtr('tutoIds')
        return tutoIds.includes(tutoId)

    }

    async addTutoId(tutoId){
        await this.tabAddAtr('tutoIds', tutoId)
    }

}