import { ChatInputCommandInteraction } from "discord.js"
import { Inter } from "./Inter"

/**
 * a custom command, watch {@link Inter} for core fonctions
 */
export abstract class Cmd extends Inter{
    public inter : ChatInputCommandInteraction

    constructor(inter){
        super(inter)

    }

    /**
     * choose interaction log message title in fonction of it type
     * 
     * @returns obj with custom title for log message, and files if inter is a cmd
     */
    chooseInterMessageTitle(): any{
        //files are only present in cmd and parsed isnide message to be logged, content is a basic discord message
        let title = { files: [], content: null }
        let options = []

        title.content = `/ ${this.inter.commandName} </${this.inter.commandName}:${this.inter.commandId}>`
        //@ts-ignore
        const cmdOptions = this.inter.options._hoistedOptions //wtf

        if(cmdOptions){
            cmdOptions.forEach(o => {
                options.push(o.value)

                //if o.type is file
                if(o.type === 11){
                    title.files.push(o.attachment)
                }

            })

        }

        for(let o in options){
            title.content += "\n`" + options[o] + "`"

        }

        return title

    }
    
}