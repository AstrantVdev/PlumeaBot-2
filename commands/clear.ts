import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"
import { delMessagesBeforeOne } from "../utils/message"


export class clear extends Cmd{

    public constructor(inter) {
        super(inter)
    }

    /**
     * where is defined the cmd
     * 
     * @returns SlashCommandBuilder with all cmd infos, name, desc, args, etc...
     */
    public static get(){
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

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
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

        if(worked){
            await mes.interSuccess(this.inter)
        }else{
            errors.push()
            await mes.interError(this.inter,c.errors.cmds.)
        }

    }
    
}