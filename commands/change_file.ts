import {Inter} from "../interObjects/Inter"
import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js"
import {Member} from "../dbObjects/Member"
import {c} from "../config"
import { InterError } from "../interObjects/InterError"

export class account_create extends Inter{

    constructor() {
        super()
    }

    /**
     * where is defined the cmd
     * 
     * @returns SlashCommandBuilder with all cmd infos, name, desc, args, etc...
     */
    get(){
        return new SlashCommandBuilder()
            .setName('account-create')
            .setDescription('Crée un compte pour un utilisateur')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addUserOption(option => option
                .setName('user')
                .setDescription('Utilisateur')
                .setRequired(true))

    }

    async customExe(inter : CommandInteraction, errors : Array<InterError>, customReply, args) : Promise<void> {
        const userId = inter.options.getUser('user').id
        const m = new Member(userId)

        if(!await m.exists()){
            await m.addOne()

        }else{
            errors.push(new InterError(c.errors.cmds.accountCreate.userExist))
        }

    }

}