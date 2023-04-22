/**
 * Abstract Class Cmd.
 *
 * @class Cmd
 */
import {
    ApplicationCommand,
    ButtonBuilder,
    ButtonComponent,
    ButtonInteraction,
    CommandInteraction,
    Interaction, ModalBuilder
} from "discord.js";
import {STRING} from "sequelize";

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const {config} = require("./config");

class Inter {

    constructor() {
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }
    }

    exe(inter) : void {
        throw new Error("Method 'exe()' must be implemented.")
    }

    speError(inter, error=null, lvl=0, convert=true) : void {
        throw new Error("Method 'speError()' must be implemented.")
    }

    interError(inter, error=null, lvl=0, customMes={ content: null, embeds: null, components: null }) : void {
        const mUtil = require("./utils/message.js")
        const { colors } = require('./utils/message.js')
        const thisClass = this

        let color = colors.yellow
        switch (lvl) {
            case 1:
                color = colors.red
                break
        }

        sendUserError()
        sendLogError()

        function sendUserError(){
            let embeds = customMes.embeds

            if(embeds) {
                let mes = require("./errors.json").cmds.default
                if (error) mes = require("./errors.json").cmds.default[error]

                switch (lvl) {
                    case 1:
                        color = colors.red
                        mes += `\nContacte le <@&${config.roles.dev}>`
                        break
                }

                embeds.push(mUtil.newEmbed()
                    .setTitle("Error ;-;")
                    .setDescription(`${mes}`)
                )
            }

            let reply = { content: customMes.content, embeds: embeds, components: customMes.components, ephemeral: true }
            inter.editReply(reply)

        }

        function sendLogError(){
            const title = thisClass.chooseInterMessageTitle(inter)

            const embed = mUtil.newEmbed(color)
                .setTitle(title.content)
                .setDescription(`**Error** | ${inter.member.user} | <#${inter.channel.id}>
                            \`\`\`${error}\`\`\``)

            let content = null
            if(lvl == 1){ content += `<@&${config.roles.dev}>` }

            mUtil.sendMes(config.channels.logs, { content: content, embeds: [embed], files: title.files })
        }

    }

    chooseInterMessageTitle(inter){
        let title = { files: [], content: null }
        let options = []

        if(inter.isChatInputCommand()){
            title.content = '/ ' + inter.commandName
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
            title.content = 'o ' + split[0]
            options = split.slice(1, split.length)

        }else if(inter.isModalSubmit()){
            const split = inter.customId.split('/')
            title.content = '% ' + split[0]
            options = split.slice(1, -1)

        }else if(inter.isStringSelectMenu() || inter.isChannelSelectMenu() || inter.isMentionableSelectMenu() || inter.isRoleSelectMenu() || inter.isUserSelectMenu()){
            const split = inter.customId.split('/')
            title.content = '^ ' + split[0]
            options = split.slice(1, -1)

        }

        for(let o in options){
            title.content += "\n`" + options[o] + "`"

        }

        return title

    }

    getSuccessMes(key, args){
        let mes = require("./newConfig.js").c.success.cmds[key]

        for (const arg in args){
            mes = mes.replace("#uwu", arg)

        }
        return mes

    }

    success(inter, convert=true, customReply=null, args = []) : void {
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

        mUtil.sendMes(config.channels.logs, {embeds: [embed], files: title.files})

    }

}

class Cmd extends Inter{

    constructor() {
        super()
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }
    }

    data() {
        throw new Error("Method 'data()' must be implemented.")
    }

    exe() {
        throw new Error("Method 'exe()' must be implemented.")
    }
    
}
