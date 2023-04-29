import {Inter} from "./cmd"
import {ButtonBuilder, ModalBuilder, ButtonStyle, ActionRowBuilder, TextInputBuilder} from "discord.js";

export const types = {
    modal: "m",
    select_menu: "s"

}
export class Menu extends Inter{
    public id : string
    public type : string
    public args : Array<string>
    public argsString : Array<string>


    constructor(args : Array<string>) {
        super()
        if (this.constructor === Menu) {
            throw new Error("Abstract classes can't be instantiated.")
        }

        // @ts-ignore
        if(typeof(args) == Array<string>){
            this.args = args

        }
    }

    public get() : ModalBuilder | ActionRowBuilder{
        throw new Error("Method 'get()' must be implemented.")
    }

    public button(){
        let customId = this.type + "/" + this.id
        this.args.forEach(arg => {
            customId += "/" + arg.toString()
        })
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(this.id)
            .setStyle(ButtonStyle.Primary)
    }

    public getButton(row = true){
        const button = this.button()

        if(row){
            return new ActionRowBuilder().setComponents(button)
        }
        return button

    }

}

export class Modal extends Menu{

    constructor(args) {
        super(args)
        if (this.constructor === Menu) {
            throw new Error("Abstract classes can't be instantiated.")
        }
        this.type = types.modal
        this.args = args
    }

}
