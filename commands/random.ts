

export class random extends Inter{
    
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
            .setName('random')
            .setDescription('Donne un nombre au hasard')
            .addIntegerOption(option => option
                .setMinValue(1)
                .setMaxValue(100)
                .setName('faces')
                .setDescription('Nombre de faces du dé virtuel (1-100')
                .setRequired(true))

    }

    public async customExe(inter : CommandInteraction, errors : Array<InterError>, customReply, args) : Promise<void> {
        let n = inter.options.getInteger('faces')
        const r = Math.floor(Math.random() * (n + 1))

        await mes.interSuccess(inter, {content: `||     ${r}     || sur ${n} !\n^^`, ephemeral : true})

	}

}