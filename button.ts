import {Inter} from "./interObjects/Inter"
import {ButtonBuilder, ModalBuilder, ButtonStyle, ActionRowBuilder, TextInputBuilder} from "discord.js";
export class Button extends Inter{
    id : string
    args : Array<string>
    row : boolean

    constructor(args, row =true) {
        super()
        if (this.constructor === Button) {
            throw new Error("Abstract classes can't be instantiated.")
        }
        this.args = args
        this.row = row
    }

    defaultButton() : ButtonBuilder{
        let customId = this.id
        this.args.forEach(arg => {
            customId += "/" + arg.toString()
        })
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(this.id)
            .setStyle(ButtonStyle.Primary)
    }

    button() : ButtonBuilder{
        return this.defaultButton()
    }

    get() : ActionRowBuilder | ButtonBuilder{
        const button = this.button()
        if(this.row){
            return new ActionRowBuilder().setComponents(button)
        }
        return button

    }

}
