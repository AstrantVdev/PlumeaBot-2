import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"


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
                .setName('safe')
                .setDescription('Permet de log les messages effacer'))

    }

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        let n = 100
        const m = inter.options.getInteger('clear_intensity')
        if(m) n = m

        let safe = false
        const b = inter.options.getBoolean('safe')
        if(b) safe = b

        let mesId = 0
        const mesOption = inter.options.getInteger('message_id')
        if(mesOption) mesId = mesOption

        const deleteMes = await mes.delMessagesBeforeOne(inter.channel, mesId, n, safe)

        if(deleteMes){
            await mes.interSuccess(inter)
        }else{
            await mes.interError(inter,"pas de messages dans ce channel !")
        }

    }
    
}