import {
    ButtonInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    ChatInputCommandInteraction,
    ChannelSelectMenuInteraction,
    UserSelectMenuInteraction,
    RoleSelectMenuInteraction,
    MentionableSelectMenuInteraction
} from "discord.js"
import {c} from "../config"

import {getAllFilesInDir} from "../util"
import {Menu} from "../menu"
import {InterError} from "./InterError"

type DiscordInter = ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | 
StringSelectMenuInteraction | ChannelSelectMenuInteraction | UserSelectMenuInteraction | RoleSelectMenuInteraction | MentionableSelectMenuInteraction


/**
 * Class to create and manage custom discord js interaction features
 */
export abstract class Inter {
    public inter: DiscordInter
    public categoryIds: [string]
    public channelIds: [string]
    public roleIds: [string]
    public userIds: [string]

    /**
     * @param inter discord js interaction get in {@link interractionCreate}
     * @param channelIds ids of channels where interaction can be executed
     * @param categoryIds ids of categories where interaction can be executed
     * @param roleIds ids of roles which can execute the interaction
     * @param userIds ids of users which can execute the interaction
     */
    public constructor(inter: DiscordInter, categoryIds: [string]=null, channelIds: [string]=null, roleIds: [string]=null, userIds: [string]=null) {
        if (this.constructor === Inter) {
            throw new Error("Abstract classes can't be instantiated.")
        }

        this.inter = inter
        this.categoryIds = categoryIds
        this.channelIds = channelIds
        this.roleIds = roleIds
        this.userIds = userIds

    }

    /**
     * execute interaction and manage errors
     */
    public async exe(): Promise<void> {
       //to avoid interaction timeout
       await this.inter.deferReply({ephemeral: true})

       //list of error fill during the process and send at the end to user and logs
       let errors : Array<InterError> = []

       //check if category and channel are both invalid
       if(!this.channelIds.includes(this.inter.channelId) && !this.categoryIds.includes(this.inter.channel.parentId)){
        errors.push(new InterError(c.errors.cmds.channel))
       }
       
       //check if role and userId are both invalid
       let hasRole = false
       this.roleIds.some(r => {
           if((this.inter.member.roles as any[]).some(role => role.id == r)){
               hasRole = true
               return false //break
           }
       })
       if(!hasRole && this.userIds.includes(this.inter.user.id)) errors.push(new InterError(c.errors.cmds.user))

       let customReply: any //reply adressed to user from config and filed with variables, bould be message, forms etc...
       let resultArgs: Array<ResultArg>= [] //list of variables that will fill success message
       this.customExe(errors, customReply, resultArgs)

       if(! errors){
           this.success(customReply, resultArgs)
       }else{
           this.sendErrors(errors)
       }

    }

    /**
     * execute some custom code when interaction is sent, must be implemented inside each interaction file
     * 
     * @param errors raw error list filled if there are errors during the process
     * @param customReply reply adressed to user if inter succeed
     * @param args list of variables and their keys to be parsed inside user and log message
     */
    public abstract customExe(errors : Array<InterError>, customReply, args): void

    /**
     * log errors and send them to user inside a unique message using special format depending of their Id, customMessage and level
     * 
     * @param errors errors gived inside customExe()
     */
    private sendErrors(errors : Array<InterError>): void {
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

        if(this.inter.isChatInputCommand()){
            userMes.embeds[0].description += `\n\n</${this.inter.commandName}:${this.inter.commandId}>`

        }else if(this.inter.isModalSubmit()){
            addMenuButton("modals")

        }else if(this.inter.isStringSelectMenu() || this.inter.isChannelSelectMenu() || this.inter.isMentionableSelectMenu() || this.inter.isRoleSelectMenu() || this.inter.isUserSelectMenu()){
            addMenuButton("selectMenus")
        }

        function addMenuButton(type){
            // @ts-ignore
            const args = this.inter.customId.split('/') //program args are paste inside customId
            const id = args[0] //first arg is component id

            const files = getAllFilesInDir(type)
            const menu : Menu = new (require(files.filter(file => file.slice(0, -3) == id)[0])[id])(args) //wtf

            userMes.components.push(menu.getButton())
        }

        //reply to user
        if(userMes.embeds[0].description == null) userMes.embeds[0].description = c.errors.cmds.default
        this.inter.editReply(userMes)

        //send log
        const title = this.chooseInterMessageTitle()

        let logMes = {
            content: null,
            embeds: [
                mUtil.newEmbed(color)
                    .setTitle(title.content)
                    .setDescription(`**Error** | ${this.inter.member.user} | <#${this.inter.channel.id}>
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
     * @returns obj with custom title for log message, and files if inter is a cmd
     */
    public abstract chooseInterMessageTitle(): any

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
     * @param customReply reply gived inside customExe function to be sent to user
     * @param args list of variables gived inside customExe to full customReply or not
     */
    public success(customReply: any, args: Array<ResultArg>): void {
        const mUtil = require("../utils/message")
        const { colors } = require('../utils/message')

        // send success message to user

        // check if customReply is ModalBuilder
        if(customReply.components){
            // @ts-ignore
            this.inter.showModal(customReply)
            this.inter.editReply({
                embeds: [
                    mUtil.newEmbed(colors.green)
                        .setDescription(c.success.cmds.default)
                ]
            })

        //if it is a string, this is a path to the interaction success message in json config
        }else if(typeof customReply == "string"){
            this.inter.editReply({
                embeds: [
                    mUtil.newEmbed(colors.green)
                        .setDescription(this.getSuccessMes(customReply, args))
                ]
            })

        //if customReply has not been filled in customExe() a default message is sent
        }else if(typeof customReply ==  undefined){
            this.inter.editReply({
                embeds: [
                    mUtil.newEmbed(colors.green)
                        .setDescription(`**Action accomplie avec succès ! :D**`)
                ]
            })

        }else{
            //check if customMessage contains special formatage like embed, forms etc...
            if (!customReply.formatted) {
                customReply.embeds = [ mUtil.newEmbed(colors.green).setDescription(customReply.content) ]
                customReply.content = null
            }
            //with this customReply is ephemeral by default
            if (customReply.ephemeral == undefined) customReply.ephemeral = true

            this.inter.editReply(customReply)

        }

        //log interaction success in logging channel

        const title = this.chooseInterMessageTitle()
        const embed = mUtil.newEmbed(colors.green)
            .setTitle(title.content)
            .setDescription(`**Success** | ${this.inter.member.user} | <#${this.inter.channel.id}>`)

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
