import {Menu} from "../menu";
import {ActionRowBuilder, ModalBuilder, TextInputBuilder} from "discord.js";

class message_sends extends Menu{

    constructor(args) {

        super(args)
    }

    public get(){
        const modal = new ModalBuilder()
            .setCustomId(this.id)
            .setTitle('Message Create/Edit')

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

}