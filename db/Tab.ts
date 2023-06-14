import { Database } from "sqlite3";
import {getAllFilesInDir} from "../util";
import {Sequelize} from "sequelize";

/**
 * class for all database tabs/objects
 */
export abstract class Tab {
    static db: Sequelize
    defaultParameter : string
    tab: Tab

    /**
     * @param tab the tab object to sync with inside db
     */
    constructor(tab) {
        this.tab.sync()
    }

    /**
     * create an item object inside db
     * @param what the tab's item object to create in db
     */
    async create(what: Object): Promise<void>{
        await this.tab.create(what)
        Tab.db.defi
    }

    /**
     * destroy a tabs's item inside db
     */
    async destroy(): Promise<void>{
        await this.tab.destroy({ where: { id: this.id } })
    }

    /**
     * check if an item exists
     * @returns if yes or not the items corresponding to the id is above 0
     */
    exist(): Promise<void>{
        return this.tab.count({ where: { id: this.id } })
            .then(count => {
                return count !== 0

            })

    }

    /**
     * get a tab's item from db 
     * @returns 
     */
    async get(): Promise<Object>{
        return await this.tab.findOne({ where: { id: this.id } })
    }

    /**
     * 
     * @param atr 
     * @returns 
     */
    async getAtr(atr: string): Promise<any>{
        const args = {
            attributes: [atr],
            raw: true
        }
        if(this.id){ args["where"] = { id: this.id } }
        const a = await this.tab.findOne(args)

        return a[atr]

    }

    /**
     * 
     * @param atr 
     * @returns 
     */
    async getMultipleAtr(atr: Array<string>): Promise<Array<any>>{
        const args = {
            attributes: atr,
            raw: true
        }
        if(this.id) args["where"] = { id: this.id }

        const occurrences = await this.tab.findAll(args)

        const multipleAtr = []
        occurrences.forEach(o => {
            let list = []
            atr.forEach(a => {
                list.push(o[a])
            })
            multipleAtr.push(list)

        })

        return multipleAtr

    }

    /**
     * 
     * @param atr 
     * @param val 
     */
    async setAtr(atr: string=this.defaultParameter, val: any): Promise<void>{
        await this.tab.update({ [atr]: val}, { where: { id: this.id } })
    }

    /**
     * 
     * @param atr 
     * @param val 
     */
    async setAtrToAll(atr: string, val: any): Promise<void>{
        await this.tab.update({ [atr]: val}, { 'where': { } } )
    }

    /**
     * 
     * @param atr 
     * @param val 
     */
    async addAtr(atr: string, val: any): Promise<void>{
        const append = {[atr]: Tab.db.fn('array_append', Tab.db.col(atr), val)}
        await this.tab.update( append, { 'where': { id: this.id } })
    }

    /**
     * 
     * @param atr 
     * @param val 
     */
    async removeAtr(atr: string, val: any): Promise<void>{
        await this.tab.update({ [atr]: Tab.db.fn('array_remove', Tab.db.col(atr), val) }, { 'where': { id: this.id } })
    }

    /**
     * 
     * @param atr the attribute inside db item (robot.name, name is the atr)
     * @param index 
     */
    async removeAtrIndex(atr: string, index: number): Promise<void>{
        const list = this.getAtr(atr)
        const o = list[index]
        await this.removeAtr(atr, o)
    }

    /**
     * increment a number atr from a certain amount
     * @param atr the attribute inside db item (robot.name, name is the atr)
     * @param i the certain amount
     */
    async incrementAtr(atr: string, i: number): Promise<void>{
        await this.tab.increment(atr, { by: i, where: { id: this.id }})
    }

}

/**
 * login in db, and sync all tabs
 */
export async function setUp(): Promise<void>{

    Tab.db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        // @ts-ignore
        port: process.env.DB_PORT

    })

    Tab.db.authenticate()
        .then(async () => {
            await console.log('Connection has been established successfully.')
            await require('./dbObjects').setUp()

        })

    await sync()
    setTimeout(() => {
        this.autoSet()

    }, 2000)
    require("./config").c.weeklyWords = await require("./utils/opinion").getWeeklyPlumes()

}

/**
 * on setup, set all cache values to the db ones
 */
export async function autoSet(): Promise<void>{
    const { isWeeklyResetDate, isBumpDate, createWeeklyResetTime, createBumpDate } =  require('./utils/somes')
    if(! await isWeeklyResetDate()) await createWeeklyResetTime()
    if(! await isBumpDate()) await createBumpDate()

}

/**
 * sync tab in cache after changements
 */
export async function sync(): Promise<void>{
    const files = getAllFilesInDir("dbObjects")

    for(const file of files){
        const object: Tab = new (require(file)[file.split("/")[-1].slice(0, -3)])()
        object.tab.sync()
    }

}