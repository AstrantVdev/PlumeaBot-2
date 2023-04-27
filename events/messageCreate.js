const { c } = require('../config')
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
            let r = Math.floor(Math.random() * (64 * 100 / c.weeklyPlumes))
            if(r === 1) await message.react(c.emotes.love)

            r = Math.floor(Math.random() * (64 * 1000 / c.weeklyPlumes))
            if(r === 1) await message.react(c.emotes.chad)

            const triggersJson = c.messageReplies
            const triggers = new Map(Object.entries(triggersJson))
            triggers.forEach((reply,trigger)=>{
                if (content.includes(trigger)) {
                    message.reply(reply)
                }
            })

            switch(channelId){

                case c.channels.central:
                    message.delete()
                    await mes.privateMes(author, 'Utilise la commande `/post` pour partager ton texte ;3')
                    return

                case c.channels.sesame:
                    message.delete()
                    await mes.privateMes(author, 'Tape la commande `/sesame` `code` pour accéder au serveur')
                    return

                case c.channels.general:
                    const today = new Date()
                    const recall = await getBumpDate()
    
                    if(today > recall){
                        message.reply('***Bumpy ! :3***')
                        today.setFullYear(today.getFullYear()+66)
                        await setBumpDate(today)
    
                    }
                    break

            }

            try{

                if (message.member.roles.cache.size < 3){

                    if (message.attachments.size > 0 || message.content.includes('http')){
                        await message.delete()
                        await author.send('__**Impossible d~envoyer ce message :**__```md\n#Tu ne peux poster ni lien, ni fichier, ni gif sans n~avoir jamais gagné de plumes :D```')
                    }

                }

            }catch(e){
                console.log(e)
                console.log(message)

            }


            if(message.channel.parentId === c.channels.textForum){

                if(await mUtils.exists(id)){

                    if(! await mUtils.hasTutoId(id, 1)){
                        const reply = "Fait la commande /commentaire dans salon associé au texte pour que le staff valide ton commentaire :)"
                        const sent = await mes.privateMes(author, reply)
                        if(! sent){
                            await message.reply(reply)
                        }

                        await mUtils.addTutoId(id, c.tutoIds.commentaire)

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