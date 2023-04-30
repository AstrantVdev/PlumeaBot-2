import {Inter} from "./cmd"
import {
    ButtonBuilder,
    ModalBuilder,
    ButtonStyle,
    ActionRowBuilder,
    TextInputBuilder,
    ModalActionRowComponentBuilder
} from "discord.js";

export const types = {
    modal: "m",
    select_menu: "s"

}

export class Menu extends Inter{
    public id : string
    public type : string
    public args : Array<string>

    constructor(args : Array<string> | string, type:string=null, id:string=null) {
        super()
        if (this.constructor === Menu) {
            throw new Error("Abstract classes can't be instantiated.")
        }

        if(Array.isArray(args)){
            this.args = args
            this.type = type
            this.id = id
        }

        if(typeof args  === "string"){
            this.args = args.split("/")
            this.type = this.args[0]
            this.id = this.args[1]
            this.args = this.args.splice(2)
        }

    }

    public menu() : ModalBuilder{
        throw new Error("Method 'menu()' must be implemented.")
    }

    public get(row=true) : ModalBuilder | ActionRowBuilder{
        if(row){
            return new ActionRowBuilder<any>().setComponents(this.menu())
        }
        return this.menu()
    }

    public button(){
        let customId = `${this.type}/${this.id}`
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

    constructor(args : Array<string> | string, id:string=null) {
        super(args, types.modal, id)
        if (this.constructor === Modal) {
            throw new Error("Abstract classes can't be instantiated.")
        }
    }

}
