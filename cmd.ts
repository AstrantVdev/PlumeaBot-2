/**
 * Abstract Class Cmd.
 *
 * @class Cmd
 */

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

    interError(inter, error=null, lvl=0, convert=true) : void {
        const { colors } = require('./utils/message.js')
        const mUtil = require("./utils/message.js")

        let mes = require("./errors.json").cmds.default
        if(error) mes = require("./errors.json").cmds.default[error]

        let color = colors.yellow

        switch (lvl){
            case 1:
                color = colors.red
                mes += "\nContacte <@548551538487066629>"
                break
        }

        const embed = mUtil.newEmbed()
            .setTitle("Error ;-;")
            .setDescription(`${mes}`)

        let reply = { embeds: [embed], ephemeral: true }


    }

    async Error(inter, error, level = 0, defer = false, link = null){

        const embed = this.newEmbed()
            .setTitle("Error ;-;")
            .setDescription(`${errorMes}`)

        if(link){
            embed.setImage(link)
        }

        let reply = { embeds: [embed], ephemeral: true }
        if(error.components){ reply.components = error.components }

        if(defer) {
            await inter.editReply(reply)
        }else{
            await inter.reply(reply)
        }

        const title = this.chooseInterMessageTitle(inter)
        const embed2 = this.newEmbed(color)
            .setTitle(title.content)
            .setDescription(`**Error** | ${inter.member.user} | <#${inter.channel.id}>
                            \`\`\`${error}\`\`\``)

        let content = ''
        if(level === 1){ content += `<@&${config.roles.dev}>` }

        await this.sendMes(config.channels.logs, { content: content, embeds: [embed2], files: title.files })

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

    success(inter) {
        console.log("eating")
    }

}

class Cmd {
    errorMes = ''

    constructor() {
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

    error(error=null, lvl=0, convert=true) {
        const { colors } = require('./utils/message.js')
        const mUtil = require("./utils/message.js")

        let mes = require("./errors.json").cmds.default
        if(error) mes = require("./errors.json").cmds.default[error]

        let color = colors.yellow

        switch (lvl){
            case 1:
                color = this.color.red
                mes += "\nContacte <@548551538487066629>"
                break
        }

        const embed = mUtil.newEmbed()
            .setTitle("Error ;-;")
            .setDescription(`${mes}`)



    }

    async interError(inter, error, level = 0, defer = false, link = null){

        let reply = { embeds: [embed], ephemeral: true }
        if(error.components){ reply.components = error.components }

        if(defer) {
            await inter.editReply(reply)
        }else{
            await inter.reply(reply)
        }

        const title = this.chooseInterMessageTitle(inter)
        const embed2 = this.newEmbed(color)
            .setTitle(title.content)
            .setDescription(`**Error** | ${inter.member.user} | <#${inter.channel.id}>
                            \`\`\`${error}\`\`\``)

        let content = ''
        if(level === 1){ content += `<@&${config.roles.dev}>` }

        await this.sendMes(config.channels.logs, { content: content, embeds: [embed2], files: title.files })

    }

    success() {
        console.log("eating")
    }
    
}


/**
 * Dog.
 *
 * @class Dog
 * @extends {Cmd}
 */
class Dog extends Cmd {
    exe() {

    }
}
