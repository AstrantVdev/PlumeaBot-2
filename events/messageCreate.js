const { config } = require('../config')
const { getBumpDate, setBumpDate } = require('../utils/somes')
const mUtils = require("../utils/member")
const mes = require("../utils/message")

module.exports = {
	name: 'messageCreate',

	async execute(message) {
        const channelId = message.channel.id
        const author = message.author
        const id = author.id

        if (!author.bot){
            const content = message.content

            //message.react(':champagne_glass:') //pour noel
            const r = Math.floor(Math.random() * (64 + 1))
            if(r === 64) await message.react(config.emotes.love)

            const triggersJson = config.messageReplies
            const triggers = new Map(Object.entries(triggersJson))
            triggers.forEach((reply,trigger)=>{
                if (content.includes(trigger)) {
                    message.reply(reply)
                }
            })

            switch(channelId){

                case config.channels.text:
                    message.delete()
                    await mes.private('Utilise la commande /post pour partager ton texte owo')
                    return
                    break

                case config.channels.general:
                    const today = new Date()
                    const recall = getBumpDate()
    
                    if(today > recall){
                        message.reply('***Bumpy ! :3***')
                        today.setFullYear(today.getFullYear()+66)
                        await setBumpDate(today)
    
                    }
                    break

            }

            if (message.member.roles.cache.size === 1){

                if (message.attachments.size >= 0 || message.content.includes('http')){
                    message.delete()
                    await author.send('__**Impossible d~envoyer ce message :**__```md\n#Tu ne peux poster ni lien, ni fichier, ni gif sans n~avoir jamais gagné de plumes :D```')
                }

            }

            if(message.channel.parentId === config.channels.textForum){

                if(await mUtils.exists(id)){

                    if(! await mUtils.hasTutoId(id, 1)){
                        const reply = "Fait la commande /commentaire dans salon associé au texte pour que la staff valide ton commentaire :)"
                        await mes.private(author, reply)
                        await message.reply(reply)

                        await mUtils.addTutoId(id, config.tutoIds.commentaire)

                    }

                }

            }

        }else{
            
            //messages disboard
            if(id === 302050872383242240){
                const embeds = message.embeds

                embeds.forEach(embed =>{

                    if(embed.data.description.includes('Bump effectué !')){
                        const recall = new Date()
                        recall.setHours(('0' + (recall.getHours() + 2)).slice(-2))
                        recall.setMinutes(('0' + (recall.getMinutes() + 30)).slice(-2))
        
                        setBumpDate(recall)
                    }

                })

            }

        }
		
	}

}