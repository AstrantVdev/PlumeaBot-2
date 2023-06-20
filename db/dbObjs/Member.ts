import {DataTypes, Error, Op} from "sequelize"
import { Item } from "../Item"
import { error } from "console"

export class Member extends Item{
    id: string
    nick: string
    joinDate: Date
    textIds: [string]
    medalsIds: [string]
    cardsIds: [string]
    plumes: number
    coins: number
    weeklyWords: number
    tutoIds: number
    extractInPostingId: string

    constructor(id=null) {
        super(id)
    }

    static tab = this.db.define('members', {
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
        textIds: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        medalsIds: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        cardsIds: {
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
        tutoIds: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        },
        extractInPostingId: DataTypes.UUID

    })

    async create(): Promise<void>{
        const date = new Date()

        await super.create({
            id: this.id,
            joinDate: date
        })
    }

    /**
     * find all members on the server since one month and without any plumes, they are considered inactives
     * @returns array of inactives members ids
     */
    static async getInactivesIds(): Promise<[string]>{
        const today = new Date()
        const limit = today.setDate(today.getDate() - 32)

        return this.db.findAll({
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

    async getNick(): Promise<string>{
        return await this.getAtr('nick')
    }

    async setNick(nick): Promise<void>{
        if(nick.length !== 4) new error("nick is 4 letters length")
        await this.setAtr('nick', nick)
    }

    async hasNick(): Promise<boolean>{
        const nick = await this.getNick()
        return nick.length === 4
    }

    async getPlumes(): Promise<number>{
        return this.getAtr('plumes')
    }

    async addPlumes(plumes): Promise<void>{
        await this.incrementAtr('plumes', plumes)
    }

    async removePlumes(plumes): Promise<void>{
        await this.incrementAtr('plumes', -plumes)
    }

    async getCoins(): Promise<number>{
        return this.getAtr("coins")
    }

    async addCoins(coins): Promise<void>{
        await this.incrementAtr('coins', coins)
    }

    async removeCoins(coins): Promise<void>{
        await this.incrementAtr('coins', -coins)
    }

    async getWeeklyWords(): Promise<number>{
        return this.getAtr('weeklyWords')
    }

    async addWeeklyWords(weeklyWords): Promise<void>{
        await this.incrementAtr('weeklyWords', weeklyWords)
    }

    async getJoinDate(): Promise<Date>{
        return this.getAtr('joinDate')

    }

    async removeWeeklyWords(weeklyWords): Promise<void>{
        await this.incrementAtr('weeklyWords', -weeklyWords)
    }

    async toMuchWeeklyWords(words): Promise<boolean>{
        const weekly = await this.getWeeklyWords()
        return weekly + words > 16000;

    }

    async resetAllWeeklyWords(): Promise<void>{
        await this.setAtrToAll('weeklyWords', 0)
    }

    async addTextId(id): Promise<void>{
        await this.addAtr('textIds', id)
    }

    async removeTextId(id): Promise<void>{
        await this.removeAtr('textIds', id)
    }

    async removeAllTextIds(): Promise<void>{
        await this.setAtr("textIds", [])
    }

    async getAllIdsPlumes(): Promise<Object[]>{
        return this.getMultipleAtr(['id', 'plumes'])
    }

    async hasTutoId(tutoId: Promise<boolean>){
        const tutoIds = await this.getAtr('tutoIds')
        return tutoIds.includes(tutoId)
    }

    async addTutoId(tutoId: Promise<void>){
        await this.addAtr('tutoIds', tutoId)
    }

}