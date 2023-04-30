import {Cmd, error} from "../cmd"
import {
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js"
import {message_sends} from "../modals/message_send"
export class message extends Cmd{

    constructor() {
        super()
    }

    get(){
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

    async customExe(inter, errors : Array<error>, customReply, args) : Promise<void> {

        switch(inter.options.getSubcommand()){
            case "send":
                customReply.components = [new message_sends(["send"]).get()]
                break
            case "edit":
                customReply.components = [new message_sends(["edit", inter.options.getString("messageId")]).get()]
                break

        }

    }

}