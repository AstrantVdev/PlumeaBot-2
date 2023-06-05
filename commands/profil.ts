

export class profil extends Inter{
    
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
			.setName('profil')
			.setDescription('Profil d~un pluméen')
			.addUserOption(option => option
				.setName('user')
				.setDescription('pluméen')
				.setRequired(true))

	}

    public async customExe(inter : CommandInteraction, errors : Array<InterError>, customReply, args) : Promise<void> {
		const member = inter.options.getMember('user')
		const id = member.id

		let nick = await m.getNick(id)
		if(nick === 'o'){ nick = "null" }
		let joinDate = await m.getJoinDate(id)
		joinDate = parseInt((joinDate.getTime() / 1000).toFixed(0))
		const plumes = await m.getPlumes(id)
		const coins = await m.getCoins(id)
		const weeklyWords = await m.getWeeklyWords(id)

		const json = c.plumesRoles
		const roles = new Map(Object.entries(json))

		let color = mes.colors.blue
		await roles.forEach(async (args, roleid)=>{

			if(await member.roles.cache.find(r => r.id === roleid)){
				color = args.color
			}

		})

		const embed = mes.newEmbed(color)
			.setDescription(`**Profil de: <@${member.id}>**\n\n· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · \n`)
			.setFields(
				{ name: "Pseudo :", value: `*${nick}*`, inline: true },
				{ name: "Plumes :", value: `*${plumes}*`, inline: true },
				{ name: "Coins :", value: `*${coins}*`, inline: true },
				{ name: "MotsHebdo :", value: `*${weeklyWords}*`, inline: true },
				{ name: "Arrivée: ", value: `<t:${joinDate}> <t:${joinDate}:R>`},
			)

		await mes.interSuccess(inter, { embeds : [embed], formatted: true, ephemeral: false })

	}

}