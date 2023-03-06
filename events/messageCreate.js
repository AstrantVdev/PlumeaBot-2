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
            let r = Math.floor(Math.random() * (64 * 100 / config.weeklyPlumes))
            if(r === 1) await message.react(config.emotes.love)

            r = Math.floor(Math.random() * (64 * 1000 / config.weeklyPlumes))
            if(r === 1) await message.react(config.emotes.chad)

            const triggersJson = config.messageReplies
            const triggers = new Map(Object.entries(triggersJson))
            triggers.forEach((reply,trigger)=>{
                if (content.includes(trigger)) {
                    message.reply(reply)
                }
            })

            switch(channelId){

                case config.channels.central:
                    message.delete()
                    await mes.private(author, 'Utilise la commande `/post` pour partager ton texte ;3')
                    return

                case config.channels.sesame:
                    message.delete()
                    await mes.private(author, 'Tape la commande `/sesame` `code` pour accéder au serveur')
                    return

                case config.channels.general:
                    const today = new Date()
                    const recall = await getBumpDate()
    
                    if(today > recall){
                        message.reply('***Bumpy ! :3***')
                        today.setFullYear(today.getFullYear()+66)
                        await setBumpDate(today)
    
                    }
                    break

            }

<<<<<<< HEAD
            if (message.member.roles.cache.size < 2){
=======
            try{

                if (message.member.roles.cache.size < 3){

                    if (message.attachments.size > 0 || message.content.includes('http')){
                        await message.delete()
                        await author.send('__**Impossible d~envoyer ce message :**__```md\n#Tu ne peux poster ni lien, ni fichier, ni gif sans n~avoir jamais gagné de plumes :D```')
                    }
>>>>>>> main

                }

            }catch(e){
                console.log(e)
                console.log(message)

            }

            if(message.channel.parentId === config.channels.textForum){

                if(await mUtils.exists(id)){

                    if(! await mUtils.hasTutoId(id, 1)){
                        const reply = "Fait la commande /commentaire dans salon associé au texte pour que le staff valide ton commentaire :)"
                        const sent = await mes.private(author, reply)
                        if(! sent){
                            await message.reply(reply)
                        }

                        await mUtils.addTutoId(id, config.tutoIds.commentaire)

                    }

                }

            }

        }else{
            
            //messages disboard
            if(id === 302050872383242240){
                const embeds = message.embeds

                if(embeds[0].data.description.includes('Bump effectué !')){
                    const recall = new Date()
                    recall.setHours(('0' + (recall.getHours() + 2)).slice(-2))
                    recall.setMinutes(('0' + (recall.getMinutes() + 30)).slice(-2))

                    await setBumpDate(recall)
                }

            }

        }
		
	}

}