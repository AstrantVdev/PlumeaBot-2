const mes = require('../utils/message')
const m =  require('../utils/member')
const { config } = require('../config')
const t = require("../utils/text");

module.exports = {
	name: 'guildMemberRemove',
	once: false,

	async execute(member) {
        const id = member.id

        if(await m.exists(id)){

            const textsUUIDs = await m.getTextsUUIDs(id)

            if(textsUUIDs.length !== 0){

                await textsUUIDs.forEach(async uuid => {
                    await t.vanish(uuid)
                })

                await m.removeAllTextsUUIDs(id)

            }

            await m.removeMember(id)

        }

        const cyaMessage = mes.newEmbed()
            .setDescription(`**${member}  | ${member.user.username} nous a quitté !!!**`)
            .setAuthor({ name: 'Niooon !', iconURL: 'https://i.imgur.com/TYeapMy.png', url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0' })
            .setThumbnail(member.displayAvatarURL())

        const cya = config.channels.cya
        await mes.sendMes(cya, {embeds: [cyaMessage]})
		
	}

}