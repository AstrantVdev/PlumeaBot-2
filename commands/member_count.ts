import { SlashCommandBuilder } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"


export class member_count extends Cmd{

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
            .setName('member_count')
            .setDescription('Donne le nombre de membres (bot exclu)')

    }

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        let count = inter.guild.memberCount
        count -= inter.guild.members.cache.filter(m => m.user.bot).size

        await mes.interSuccess(inter, '**Aujourdhui pluméa compte ||   ' + count  + '   || âmes ! :D**')

    }
    
}