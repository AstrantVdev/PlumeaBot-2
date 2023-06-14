import { ButtonInteraction } from "discord.js"
import { Inter } from "./Inter"

/**
 * 
 */
export abstract class Button extends Inter{
    inter : ButtonInteraction

    /**
     * a custom button, watch {@link Inter} for core fonctions
     * @param inter the discord js interaction
     */
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
        let title = { content: null }
        let options = []

        const split = this.inter.customId.split('/')
        title.content = '🔘 ' + split[0]
        options = split.slice(1, split.length)

        for(let o in options){
            title.content += "\n`" + options[o] + "`"

        }

        return title

    }
    
}