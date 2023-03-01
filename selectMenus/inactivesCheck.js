const { ActionRowBuilder, StringSelectMenuBuilder  } = require('discord.js')
const { config } =  require("../config")
const mUtils = require("../utils/member")
const mes = require("../utils/message")

module.exports = {
    name: 'inactivesCheck',

    async execute(inter){
        inter.deferReply()

        const membersIds = inter.values

        membersIds.forEach(async (id, i) => {

            if(await mUtils.exists(id)){

                setTimeout(async () => {
                    await mUtils.removeMember(id)
                    const m = await inter.guild.members.fetch(id)
                    await m.roles.remove(config.roles.pluméen)

                }, i * 1000)

            }

        })

        await mes.interSuccess(inter, null, true)

    },

    async get(inactivesIds, inter){

        let menu = new StringSelectMenuBuilder()
            .setCustomId(this.name)
            .setPlaceholder('Choisis les gens')

        let nothing = true
        await inactivesIds.forEach(async id => {
            const m = await inter.guild.members.fetch(id)

            if(m.roles.cache.size <= 2){
                menu.addOptions({ label: m.user.tag, description: id, value: id })
                nothing = false

            }
        })

        if(! nothing){
            return new ActionRowBuilder()
                .setComponents(menu)
        }
        return null

    }

}