

export class member_count extends Inter{
    
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
            .setName('member_count')
            .setDescription('Donne le nombre de membres (bot exclu)')

    }

    public async customExe(inter : CommandInteraction, errors : Array<InterError>, customReply, args) : Promise<void> {
        let count = inter.guild.memberCount
        count -= inter.guild.members.cache.filter(m => m.user.bot).size

        await mes.interSuccess(inter, '**Aujourdhui pluméa compte ||   ' + count  + '   || âmes ! :D**')

    }
    
}