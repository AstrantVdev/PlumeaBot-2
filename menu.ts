import {Inter} from "./cmd"
import {ButtonBuilder, ModalBuilder, ButtonStyle, ActionRowBuilder, TextInputBuilder} from "discord.js";
class Menu extends Inter{
    public id : string
    public args : Array<string>

    constructor(args) {
        super()
        if (this.constructor === Menu) {
            throw new Error("Abstract classes can't be instantiated.")
        }
        this.args = args
    }

    public get() : ModalBuilder | ActionRowBuilder{
        throw new Error("Method 'get()' must be implemented.")

        const xD = new Inter()
        let test = new (require("./cmd")["Inter"])()
        test.

        const modal = new ModalBuilder()
            .setCustomId(this.id)
            .setTitle('Crée le Sprint ! :D')

        const words = new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                    .setCustomId('words')
                    .setLabel('Ton nombre actuel de mots')
                    .setRequired(false)
                    .setMaxLength(6)
            )

        // @ts-ignore
        return modal.addComponents(words)

    }

    public defaultButton() : ButtonBuilder{
        let customId = this.id
        this.args.forEach(arg => {
            customId += "/" + arg.toString()
        })
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(this.id)
            .setStyle(ButtonStyle.Primary)
    }

    public button(){
        return this.defaultButton()
    }

    public getButton(row = true){
        const button = this.defaultButton()

        if(row){
            return new ActionRowBuilder().setComponents(button)
        }
        return button

    }

}
