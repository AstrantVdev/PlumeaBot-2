import {Cmd, error} from "../cmd"
import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js"
import {Member} from "../dbObjects/Member"
import {c} from "../config"

export class button extends Cmd{

    constructor() {
        super()
    }

    get(){
        return new SlashCommandBuilder()
            .setName('button')
            .setDescription('Crée un bouton')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addSubcommand(sub => sub
                .setName('basic')
                .setDescription('Crée un bouton avec les data données'))
            .addSubcommand(sub => sub
                .setName('role')
                .setDescription('Crée un bouton donnant un role'))
            .addSubcommand(sub => sub
                .setName('modal')
                .setDescription('Crée un bouton donnant accès à un modal'))
            .addSubcommand(sub => sub
                .setName('select_menu')
                .setDescription('Crée un bouton donnant accès à un menu de sélection'))
    }

    async customExe(inter : CommandInteraction, errors : Array<error>, customReply, args) : Promise<void> {
        const userId = inter.options.getUser('user').id
        const m = new Member(userId)

        switch (inter.options.){

        }

    }

}