import {
    ButtonInteraction,
    CommandInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction
} from "discord.js"
import {c} from "../config"

import {getAllFilesInDir} from "../util"
import {Menu} from "../menu"
import {InterError} from "./InterError"

type DiscordInter = CommandInteraction | ButtonInteraction | ModalSubmitInteraction | StringSelectMenuInteraction


/**
 * Class to create and manage custom discord js interaction features
 */
export class Inter {
    /**
     * @param channelIds ids of channels where interaction can be executed
     */
    public channelIds: [string]
    /**
     * @param categoryIds ids of categories where interaction can be executed
     */
    public categoryIds: [string]
    /**
     * @param rolesIds ids of roles which can execute the interaction
     */
    public roleIds: [string]
    /**
     * @param userIds ids of users which can execute the interaction
     */
    public userIds: [string]

    public constructor() {
        if (this.constructor === Inter) {
            throw new Error("Abstract classes can't be instantiated.")
        }

    }

    /**
     * return discordjs' interaction builder
     */
    public get() {
        throw new Error("Method 'get()' must be implemented.")
    }

    /**
     * execute interaction and manage errors
     * 
     * @param inter the base discord js interaction to be executed
     */
    public async exe(inter : DiscordInter): Promise<void> {
       //to avoid interaction timeout
       await inter.deferReply({ephemeral: true})

       //list of error fill during the process and send at the end to user and logs
       let errors : Array<InterError> = []

       //check if category and channel are both invalid
       if(!this.channelIds.includes(inter.channelId) && !this.categoryIds.includes(inter.channel.parentId)){
        errors.push(new InterError(c.errors.cmds.channel))
       }
       
       //check if role and userId are both invalid
       let hasRole = false
       this.roleIds.some(r => {
           if((inter.member.roles as any[]).some(role => role.id == r)){
               hasRole = true
               return false //break
           }
       })
       if(!hasRole && this.userIds.includes(inter.user.id)) errors.push(new InterError(c.errors.cmds.user))

       let customReply: any //reply adressed to user from config and filed with variables, bould be message, forms etc...
       let resultArgs: Array<ResultArg>= [] //list of variables that will fill success message
       this.customExe(inter, errors, customReply, resultArgs)

       if(! errors){
           this.success(inter, customReply, resultArgs)
       }else{
           this.sendErrors(inter, errors)
       }

    }

    /**
     * execute some custom code when interaction is sent, must be implemented inside each interaction file
     * 
     * @param inter discord js interaction
     * @param errors raw error list filled if there are errors during the process
     * @param customReply reply adressed to user if inter succeed
     * @param args list of variables and their keys to be parsed inside user and log message
     */
    public customExe(inter : DiscordInter, errors : Array<InterError>, customReply, args): void {
        throw new Error("Method 'customExe()' must be implemented.")
    }

    /**
     * log errors and send them to user inside a unique message using special format depending of their Id, customMessage and level
     * 
     * @param inter the discord js interaction
     * @param errors errors gived inside customExe()
     */
    private sendErrors(inter: DiscordInter, errors : Array<InterError>): void {
        const mUtil = require("../utils/message")
        const { colors } = require('../utils/message')

        let lvl = 0 //set default error level to 0
        let userMes = { //set default message
            content: null,
            embeds: [mUtil.newEmbed()
                .setTitle("Erreur ;-;")],
            components: null
        }

        //interate all errors
        errors.forEach( er => {
            //choose higher error level
            if (er.lvl > lvl) lvl = er.lvl
            
            //just concatenate error messages
            userMes.content += er.customMes.content
            
            //usefull because inside a customExe(), some special embed must be parsed in ALL errors to be sure the embed is sent
            //if there is only one. Alas with this method there is duplicate
            er.customMes.components.forEach(c => {
                if(! userMes.components.includes(c)) userMes.components.push(c)
            })

            //same with components
            er.customMes.embeds.forEach(e => {
                if(! userMes.embeds.includes(e)) userMes.embeds.push(e)
            })
            
            //put error's message from config inside message
            if (er.errorId != null) userMes.embeds[0].description += `\n - ${c.errors.cmds[er.errorId]}`

        })

        //set message
        let color = colors.yellow
        switch (lvl) {
            case 1:
                color = colors.red
                userMes.content += `\nContacte le <@&${c.roles.dev}>`
                break
        }

        if(inter.isChatInputCommand()){
            userMes.embeds[0].description += `\n\n</${inter.commandName}:${inter.commandId}>`

        }else if(inter.isModalSubmit()){
            addMenuButton("modals")

        }else if(inter.isStringSelectMenu() || inter.isChannelSelectMenu() || inter.isMentionableSelectMenu() || inter.isRoleSelectMenu() || inter.isUserSelectMenu()){
            addMenuButton("selectMenus")
        }

        function addMenuButton(type){
            // @ts-ignore
            const args = inter.customId.split('/') //program args are paste inside customId
            const id = args[0] //first arg is component id

            const files = getAllFilesInDir(type)
            const menu : Menu = new (require(files.filter(file => file.slice(0, -3) == id)[0])[id])(args) //wtf

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

    /**
     * choose interaction log message title in fonction of it type
     * 
     * @param inter discord js interaction
     * 
     * @returns obj with custom title for log message, and files if inter is a cmd
     */
    private chooseInterMessageTitle(inter): any{
        //files are only present in cmd and parsed isnide message to be logged, content is a basic discord message
        let title = { files: [], content: null }
        let options = []

        if(inter.isChatInputCommand()){
            title.content = `/ ${inter.commandName} </${inter.commandName}:${inter.customId}>`
            const cmdOptions = inter.options._hoistedOptions

            if(cmdOptions){
                cmdOptions.forEach(o => {
                    options.push(o.value)

                    //if o.type is file
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

    /**
     * get default success message and fill it with execution values
     * 
     * @param key path to the success message inside json config
     * @param args variables filled inside customExe()
     * 
     * @returns success message with filled with variables
     */
    private getSuccessMes(key: string, args: Array<ResultArg>): string{
        let mes = require("./newConfig.js").c.success.cmds[key]

        args.forEach(arg => {
            arg.fillMessage(mes)
        })
        return mes

    }

    /**
     * send good message to user and log success
     * 
     * @param inter discord interaction
     * @param customReply reply gived inside customExe function to be sent to user
     * @param args list of variables gived inside customExe to full customReply or not
     */
    public success(inter, customReply: any, args: Array<ResultArg>): void {
        const mUtil = require("../utils/message")
        const { colors } = require('../utils/message')

        //send success message to user

        //check if customReply is ModalBuilder
        if(customReply.components){
            inter.showModal(customReply)
            inter.editReply({
                embeds: [
                    mUtil.newEmbed(colors.green)
                        .setDescription(c.success.cmds.default)
                ],
                ephemeral: true
            })

        //if it is a string, this is a path to the interaction success message in json config
        }else if(typeof customReply == "string"){
            inter.editReply({
                embeds: [
                    mUtil.newEmbed(colors.green)
                        .setDescription(this.getSuccessMes(customReply, args))
                ],
                ephemeral: true
            })

        //if customReply has not been filled in customExe() a default message is sent
        }else if(typeof customReply ==  undefined){
            inter.editReply({
                embeds: [
                    mUtil.newEmbed(colors.green)
                        .setDescription(`**Action accomplie avec succès ! :D**`)
                ],
                ephemeral: true
            })

        }else{
            //check if customMessage contains special formatage like embed, forms etc...
            if (!customReply.formatted) {
                customReply.embeds = [ mUtil.newEmbed(colors.green).setDescription(customReply.content) ]
                customReply.content = null
            }
            //with this customReply is ephemeral by default
            if (customReply.ephemeral == undefined) customReply.ephemeral = true

            inter.editReply(customReply)

        }

        //log interaction success in logging channel

        const title = this.chooseInterMessageTitle(inter)
        const embed = mUtil.newEmbed(colors.green)
            .setTitle(title.content)
            .setDescription(`**Success** | ${inter.member.user} | <#${inter.channel.id}>`)

        mUtil.sendMes(c.channels.logs, {embeds: [embed], files: title.files})

    }

}

/**
 * arg created in command's execution which fill success message
 */
export class ResultArg {
    public arg: string
    public key: string

    constructor(arg: string, key: string) {
        /**
         * @param arg arg value
         */
        this.arg = arg
        /**
         * @param key key replaced by value in default message from config
         */
        this.key = key
    }

    /**
     * fill a string which will be filled with arg value for each key occurence
     * 
     * @param message the input string
     */
    fillMessage(message: string): void {
        message =  message.replace(this.key, this.arg)
    }

}
