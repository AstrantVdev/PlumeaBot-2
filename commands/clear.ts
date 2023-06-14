import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"
import { delMessagesBeforeOne } from "../utils/message"
import { c } from "../config"


export class clear extends Cmd{

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
            .setName('clear')
            .setDescription('Atomise tout les messages du salon')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addIntegerOption(option => option
                .setName('message_id')
                .setDescription('Id du message à partir duquel effacer'))
            .addIntegerOption(option => option
                .setMinValue(1)
                .setName('clear_intensity')
                .setDescription('Nombre de messages à effacer'))
            .addBooleanOption(option =>  option
                .setName('logged')
                .setDescription('Permet de log les messages effacer'))

    }

    async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        // set number of messages to be deleted
        let n = 100
        const m = this.inter.options.getInteger('clear_intensity')
        if(m) n = m

        // set if messages will be logged or not
        let logged = false
        const b = this.inter.options.getBoolean('logged')
        if(b) logged = b

        // n messages before this one will be deleted
        let mesId = 0
        const mesOption = this.inter.options.getInteger('message_id')
        if(mesOption) mesId = mesOption

        const worked = await delMessagesBeforeOne(this.inter.channel, mesId, n, logged)

        if(! worked){
            errors.push(new InterError(c.errors.cmds.clear.no_message))
        }

    }
    
}