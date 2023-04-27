import {Cmd} from "./cmd";
import {getAllFilesInDir} from "./util";
import {Sequelize} from "sequelize";
export let db

export class Tab {
    public tab
    public id : string
    public defaultParameter : string

    constructor(id=null) {
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }
        this.tab.sync()
        this.id = id

    }

    async addOne(tab){
        await db.tabCreate(tab)
    }

    async getMember(){
        await this.get()
    }

    async removeOne(){
        await this.destroy()
    }

    async exists(){
        return this.exist()
    }

    /*
    logEdit(edit){
        const messageUtil = require('./utils/message')
        const messageEmbed = messageUtil.newEmbed()
        .setTitle('dbEdit')
        .setAuthor({ name: 'o', iconURL: 'https://i.imgur.com/TYeapMy.png', url: 'https://discord.gg/arbnrxWFVu' })
        .setDescription(edit)

        const logsId = config.channels.logs

        client.channels.fetch(logsId)
        .then(channel => channel.send({embeds:[messageEmbed]}))
        .catch(console.error)
    },
    */

    async create(what){
        await this.tab.create(what)
    }

    async destroy(){
        await this.tab.destroy({ where: { id: this.id } })
    }

    exist(){
        return this.tab.count({ where: { id: this.id } })
            .then(count => {
                return count !== 0

            })

    }

    async get(){
        return await this.tab.findOne({ where: { id: this.id } })
    }

    async getAtr(atr){
        const args = {
            attributes: [atr],
            raw: true
        }
        if(this.id){ args["where"] = { id: this.id } }
        const a = await this.tab.findOne(args)

        return a[atr]

    }

    async getMultipleAtr(atr){
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

    async setAtr(atr=this.defaultParameter, val){
        await this.tab.update({ [atr]: val}, { where: { id: this.id } })
    }

    async setAtrToAll(atr, val){
        await this.tab.update({ [atr]: val}, { 'where': { } } )
    }

    async addAtr(atr, val){
        const append = {[atr]: db.fn('array_append', db.col(atr), val)}
        await this.tab.update( append, { 'where': { id: this.id } })
    }

    async removeAtr(atr, val){
        await this.tab.update({ [atr]: db.fn('array_remove', db.col(atr), val) }, { 'where': { id: this.id } })
    }

    async removeAtrIndex(atr, index){
        const list = this.getAtr(atr)
        const o = list[index]
        await this.removeAtr(atr, o)
    }

    async incrementAtr(atr, i){
        await this.tab.increment(atr, { by: i, where: { id: this.id }})
    }

}

export async function setUp(){

    db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        // @ts-ignore
        port: process.env.DB_PORT

    })

    db.authenticate()
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

export async function autoSet(){
    const { isWeeklyResetDate, isBumpDate, createWeeklyResetTime, createBumpDate } =  require('./utils/somes')
    if(! await isWeeklyResetDate()) await createWeeklyResetTime()
    if(! await isBumpDate()) await createBumpDate()

}

export function sync(){
    const files = getAllFilesInDir("dbObjects")

    for(const file of files){
        const object : Tab = new (require(file)[file.split("/")[-1].slice(0, -3)])()
        object.tab.sync()

    }

}