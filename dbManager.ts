import {Cmd} from "./cmd";
import {getAllFilesInDir} from "./util";
import {Sequelize} from "sequelize";

export let sequelize

export class DbObject{
    public tab
    public id : string

    constructor(id=null) {
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }
        this.tab.sync()
        this.id = id

    }

    async getMember(){
        await this.tabGet()
    }

    async addOne(){
        throw new Error("Method 'addOne()' must be implemented.")
    }

    async removeOne(){
        await this.tabDestroy()
    }

    async exists(){
        return this.tabExist()
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

    async tabCreate(what){
        await this.tab.create(what)
    }

    async tabDestroy(){
        await this.tab.destroy({ where: { id: this.id } })
    }

    tabExist(){
        return this.tab.count({ where: { id: this.id } })
            .then(count => {
                return count !== 0

            })

    }

    async tabGet(){
        return await this.tab.findOne({ where: { id: this.id } })
    }

    async tabGetAtr(atr){
        const args = {
            attributes: [atr],
            raw: true
        }
        if(this.id){ args["where"] = { id: this.id } }
        const a = await this.tab.findOne(args)

        return a[atr]

    }

    async tabGetMultipleAtr(atr){
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

    async tabSetAtr(atr, val){
        await this.tab.update({ [atr]: val}, { where: { id: this.id } })
    }

    async tabSetAtrToAll(atr, val){
        await this.tab.update({ [atr]: val}, { 'where': { } } )
    }

    async tabAddAtr(atr, val){
        const append = {[atr]: sequelize.fn('array_append', sequelize.col(atr), val)}
        await this.tab.update( append, { 'where': { id: this.id } })
    }

    async tabRemoveAtr(atr, val){
        await this.tab.update({ [atr]: sequelize.fn('array_remove', sequelize.col(atr), val) }, { 'where': { id: this.id } })
    }

    async tabRemoveAtrIndex(atr, index){
        const list = this.tabGetAtr(atr)
        const o = list[index]
        await this.tabRemoveAtr(atr, o)
    }

    async tabIncrementAtr(atr, i){
        await this.tab.increment(atr, { by: i, where: { id: this.id }})
    }

}

export async function setUp(){

    sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        // @ts-ignore
        port: process.env.DB_PORT

    })

    sequelize
        .authenticate()
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
        const object : DbObject = new (require(file)[file.split("/")[-1].slice(0, -3)])()
        object.tab.sync()

    }

}