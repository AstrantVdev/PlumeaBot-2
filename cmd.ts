import {
    ButtonInteraction,
    CommandInteraction,
    ModalBuilder, ModalSubmitInteraction, SelectMenuInteraction
} from "discord.js"
const { c } = require("./config.js")
import {getAllFilesInDir} from "./util"
import {Menu} from "./menu"

class error {
    public errorId: any
    public lvl: any
    public customMes: any

    constructor(errorId=null, lvl=0, customMes={ content: null, embeds: null, components: null }) {
        this.errorId = errorId
        this.lvl = lvl
        this.customMes = customMes
    }

}
export class Inter {
    public channelIds: [string]
    public categoryIds: [string]
    public roleIds: [string]
    public userIds: [string]

    constructor() {
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }

    }

    public get() {
        throw new Error("Method 'get()' must be implemented.")
    }

    public async exe(inter : CommandInteraction | ButtonInteraction | ModalSubmitInteraction | SelectMenuInteraction) : Promise<void> {
        await inter.deferReply({ephemeral: true})

        let errors : Array<error> = []

        if(this.channelIds.includes(inter.channelId)) errors.push(c.errors.cmds.channel)
        if(this.categoryIds.includes(inter.channel.parentId)) errors.push(c.errors.cmds.category)
        if(this.userIds.includes(inter.user.id)) errors.push(c.errors.cmds.channel)

        let hasRole = false
        this.roleIds.some(r => {
            // @ts-ignore
            if(inter.member.roles.some(role => role.id == r)){
                hasRole = true
                return false //break
            }
        })
        if(!hasRole) errors.push(c.errors.cmds.role)


        this.customExe(inter, errors)

        if(! errors){
            this.success(inter)
        }else{
            this.sendErrors(inter, errors)
        }

    }

    public customExe(inter : CommandInteraction | ButtonInteraction | ModalSubmitInteraction | SelectMenuInteraction, errors : Array<error>) : void {
        throw new Error("Method 'exe()' must be implemented.")
    }

    private sendErrors(inter, errors : Array<error>) : void {
        const mUtil = require("./utils/message.js")
        const { colors } = require('./utils/message.js')

        let lvl = 0
        let userMes = {
            content: null,
            embeds: [mUtil.newEmbed()
                .setTitle("Erreur ;-;")],
            components: null
        }

        //boucle toutes les erreurs rencontrées
        errors.forEach( er => {
            if (er.lvl > lvl) lvl = er.lvl

            userMes.content += er.customMes.content

            er.customMes.components.forEach(c => {
                if(! userMes.components.includes(c)) userMes.components.push(c)
            })

            er.customMes.embeds.forEach(e => {
                if(! userMes.embeds.includes(e)) userMes.embeds.push(e)
            })

            if (er.errorId != null) userMes.embeds[0].description += `\n - ${c.errors.cmds[er.errorId]}`

        })

        let color = colors.yellow
        switch (lvl) {
            case 1:
                color = colors.red
                userMes.content += `\nContacte le <@&${c.roles.dev}>`
                break
        }

        if(inter.isChatInputCommand()){
            userMes.embeds[0].description += `\n\n</${inter.commandName}:${inter.customId}>`
        }else if(inter.isModalSubmit()){
            addMenuButton("modals")
        }else if(inter.isStringSelectMenu() || inter.isChannelSelectMenu() || inter.isMentionableSelectMenu() || inter.isRoleSelectMenu() || inter.isUserSelectMenu()){
            addMenuButton("selectMenus")
        }

        function addMenuButton(type){
            const args = inter.customId.split('/')
            const id = args[0]

            const files = getAllFilesInDir(type)
            const menu : Menu = new (require(files.filter(file => file.slice(0, -3) == id)[0])[id])(args)

            userMes.components.push(menu.getButton())
        }

        //reply to user
        if(userMes.embeds[0].description == null) userMes.embeds[0].description = c.errors.cmds.default
        inter.editReply(userMes)

        //send log
        const title = this.chooseInterMessageTitle(inter)

        let logMes = {
            content: null,
            embeds: [
                mUtil.newEmbed(color)
                    .setTitle(title.content)
                    .setDescription(`**Error** | ${inter.member.user} | <#${inter.channel.id}>
                            \`\`\`${userMes.embeds[0].description}\`\`\``)
            ],
            files: title.files
        }

        if(lvl == 1) logMes.content = `<@&${c.roles.dev}>`

        mUtil.sendMes(c.channels.logs, logMes)

    }

    private chooseInterMessageTitle(inter){
        let title = { files: [], content: null }
        let options = []

        if(inter.isChatInputCommand()){
            title.content = `/ ${inter.commandName} </${inter.commandName}:${inter.customId}>`
            const cmdOptions = inter.options._hoistedOptions

            if(cmdOptions){
                cmdOptions.forEach(o => {
                    options.push(o.value)

                    if(o.type === 11){
                        title.files.push(o.attachment)
                    }

                })

            }

        }else if(inter.isButton()){
            const split = inter.customId.split('/')
            title.content = '🔘 ' + split[0]
            options = split.slice(1, split.length)

        }else if(inter.isModalSubmit()){
            const split = inter.customId.split('/')
            title.content = '📑 ' + split[0]
            options = split.slice(1, -1)

        }else if(inter.isStringSelectMenu() || inter.isChannelSelectMenu() || inter.isMentionableSelectMenu() || inter.isRoleSelectMenu() || inter.isUserSelectMenu()){
            const split = inter.customId.split('/')
            title.content = '📄 ' + split[0]
            options = split.slice(1, -1)

        }

        for(let o in options){
            title.content += "\n`" + options[o] + "`"

        }

        return title

    }

    private getSuccessMes(key, args){
        let mes = require("./newConfig.js").c.success.cmds[key]

        for (const arg in args){
            mes = mes.replace("#uwu", arg)

        }
        return mes

    }

    public success(inter, customReply=null, args = []) : void {
        const mUtil = require("./utils/message.js")
        const { colors } = require('./utils/message.js')

        switch(typeof customReply) {
            // @ts-ignore
            case ModalBuilder:
                inter.showModal(customReply)
                break

            case "string":
                inter.editReply({
                    embeds: [
                        mUtil.newEmbed(colors.green)
                            .setDescription(this.getSuccessMes(customReply, args))
                    ],
                    ephemeral: true
                })
                break

            case undefined: //none
                inter.editReply({
                    embeds: [
                        mUtil.newEmbed(colors.green)
                            .setDescription(`**Action accomplie avec succès ! :D**`)
                    ],
                    ephemeral: true
                })
                break

            default:
                if (!customReply.formatted) {
                    customReply.embeds = [ mUtil.newEmbed(colors.green).setDescription(customReply.content) ]
                    customReply.content = null
                }
                if (customReply.ephemeral == undefined) customReply.ephemeral = true

                inter.editReply(customReply)

        }

        const title = this.chooseInterMessageTitle(inter)
        const embed = mUtil.newEmbed(colors.green)
            .setTitle(title.content)
            .setDescription(`**Success** | ${inter.member.user} | <#${inter.channel.id}>`)

        mUtil.sendMes(c.channels.logs, {embeds: [embed], files: title.files})

    }

}

export class Cmd extends Inter{

    constructor() {
        super()
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }

    }

}
