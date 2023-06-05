import {
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js"
import {message_sends} from "../modals/message_send"
import { Cmd } from "../interObjects/Cmd"
import { InterError } from "../interObjects/InterError"

export class message extends Cmd{

    public constructor(inter) {
        super(inter)
    }

    public static get(){
        return new SlashCommandBuilder()
            .setName('account-create')
            .setDescription('Crée un compte pour un utilisateur')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addSubcommand(sub => sub
                .setName('send')
                .setDescription('Envoie un message avec des data'))
            .addSubcommand(sub => sub
                .setName('edit')
                .setDescription('Edit un message avec des data')
                .addStringOption(option => option
                    .setName("messageId")
                    .setDescription("L'id du message à éditer")
                    .setRequired(true)))
    }

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {

        switch(this.inter.options.getSubcommand()){
            case "send":
                customReply.components = [new message_sends(["send"]).get()]
                break
            case "edit":
                customReply.components = [new message_sends(["edit", this.inter.options.getString("messageId")]).get()]
                break

        }

    }

}