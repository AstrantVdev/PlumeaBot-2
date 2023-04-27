const { SlashCommandBuilder} = require('discord.js')
const mes =  require('../utils/message')
const { c } = require('../config')
const sUtils = require('../utils/sprint')

module.exports = {
	data(){
        return new SlashCommandBuilder()
        .setName('sprint')
        .setDescription('Bah Sprint... O.o')

    },

    async execute(inter) {
        const channelId = inter.channel.id

        if(await sUtils.isChannel(channelId)){

            await mes.interSuccess(inter, require("../modals/sprintBegin").get())


            /*

            if(! await sUtils.isSprinting(0)){
                await mes.interSuccess(inter, require("../modals/sprintBegin").get())

            }else{
                const message = await mes.getMes(config.channels.sprint, await sUtils.getMessageId(0))
                await mes.interSuccess(
                    inter,
                    {
                        content: "Un sprint est déjà en cours, rejoins le :",
                        components: [require("../buttons/link").get(message.url)]
                    })
            }
            */

        }else{
            await mes.interError(inter,'Mauvais salon, va dans <#' + c.channels.sprint + ">")
        }
    
    }

}