import {Cmd} from "./cmd";
import {getAllFilesInDir} from "./util";
import {Sequelize} from "sequelize";

export let sequelize

export class DbObject{
    public sequelize : Sequelize

    constructor() {
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }
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

    async tabCreate(tab, what){
        await tab.create(what)
    }

    async tabDestroy(tab, id){
        await tab.destroy({ where: { id: id } })
    }

    tabExist(tab, id){
        return tab.count({ where: { id: id } })
            .then(count => {
                return count !== 0

            })

    }

    async tabGet(tab, id){
        return await tab.findOne({ where: { id: id } })
    }

    async tabGetAtr(tab, id, atr){
        const args = {
            attributes: [atr],
            raw: true
        }
        if(id){ args["where"] = { id: id } }
        const a = await tab.findOne(args)

        return a[atr]

    }

    async tabGetMultipleAtr(tab, id, atr){
        const args = {
            attributes: atr,
            raw: true
        }
        if(id) args["where"] = { id: id }

        const occurrences = await tab.findAll(args)

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

    async tabSetAtr(tab, id, atr, val){
        await tab.update({ [atr]: val}, { where: { id: id } })
    }

    async tabSetAtrToAll(tab, atr, val){
        await tab.update({ [atr]: val}, { 'where': { } } )
    }

    async tabAddAtr(tab, id, atr, val){
        const append = {[atr]: sequelize.fn('array_append', sequelize.col(atr), val)}
        await tab.update( append, { 'where': { id: id } })
    }

    async tabRemoveAtr(tab, id, atr, val){
        await tab.update({ [atr]: sequelize.fn('array_remove', sequelize.col(atr), val) }, { 'where': { id: id } })
    }

    async tabRemoveAtrIndex(tab, id, atr, index){
        const list = this.tabGetAtr(tab, id, atr)
        const o = list[index]
        await this.tabRemoveAtr(tab, id, atr, o)
    }

    async tabIncrementAtr(tab, id, atr, i){
        await tab.increment(atr, { by: i, where: { id: id }})
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
        object.sequelize.sync()

    }

}