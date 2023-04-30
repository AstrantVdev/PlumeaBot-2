import {Modal} from "../menu";
import {ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export class message_sends extends Modal{

    constructor(args) {
        super(args, "message_sends")
    }

    public menu(){
        const modal = new ModalBuilder()
            .setCustomId(this.id)
            .setTitle('Message Create/Edit')

        const data = new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .setComponents(
                new TextInputBuilder()
                    .setCustomId('data')
                    .setLabel('Ton nombre actuel de mots')
                    .setStyle(TextInputStyle.Paragraph)
            )

        return modal.addComponents(data)
    }

}