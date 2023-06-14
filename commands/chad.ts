import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js"
import {Member} from "../dbObjects/Member"
import {c} from "../config"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"

/**
 * spam a certain number of chad gif, because u know... chad supremacy etc...
 */
export class account_create extends Cmd{

    constructor(inter) {
        super(inter)
    }

    /**
     * where is defined the cmd
     * 
     * @returns SlashCommandBuilder with all cmd infos, name, desc, args, etc...
     */
    static get(){
        return new SlashCommandBuilder()
            .setName('account-create')
            .setDescription('Crée un compte pour un utilisateur')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addUserOption(option => option
                .setName('user')
                .setDescription('Utilisateur')
                .setRequired(true))

    }

    async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        const userId = this.inter.options.getUser('user').id
        const m = new Member(userId)

        if(!await m.exists()){
            await m.addOne()

        }else{
            errors.push(new InterError(c.errors.cmds.accountCreate.userExist))
        }

    }

}