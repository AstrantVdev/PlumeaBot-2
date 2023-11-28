const { config } = require('../config')
const { getBumpDate, setBumpDate } = require('../utils/somes')
const mes = require("../utils/message")
const somes = require("../utils/somes")
const tUtils = require("../utils/text")
const sesame = require('../commands/sesame')

module.exports = {
	name: 'messageCreate',

	async execute(message) {
        const channelId = message.channel.id
        const author = message.author
        const id = author.id

        if(message.content == "azerth1egs6zh84rseg65r4seg2ew4g5") {

            all_texts = await T_TAB.findAll()

            for await (t of all_texts) {
                console.log(t.postId)

                if(t.postId ==0 ) continue
                try {
                    let post = await client.channels.fetch(t.postId)

                    let text_id = t.id_text
                    let title = text_id.substr(0, 6)
                    let chap = text_id.substr(6, 7)
                    let autor = text_id.substr(13, 17)

                    if(post.archived){
                        await post.setArchived(false)
                    }
    
                    await post.setName(`${title} ${chap} ${autor} | <@${t.authorId}>`)

                }catch {
                    continue
                }

            }

        }

        if (!author.bot){
            const content = message.content
	    
	    if(content.includes("rawette")){
		    message.react("🇷")
		    message.react("🇦")
		    message.react("🇼")
		    message.react("🇪")
		    message.react("🇹")
		    
		    reply = await message.reply("# RAWETTE")
		    setTimeout(() => {  reply.delete() }, 1000)

	    }

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

            if (config.channels.sesame === message.channel.parentId){
                if(! await somes.memberCheckRoles(message.member, [config.roles.staff])){
                    await sesame.sesame(content, message.member)
                    await message.delete()
                    return

                }
            }

            if(message.channel.parentId === config.channels.textForum){
                const messages = await message.channel.messages.fetch({ limit: 64 })

                if(! await somes.memberCheckRoles(message.member, [config.roles.staff, config.roles.guard])){
                    const textUUId = await tUtils.getTextUUIDByPostId(message.channel.id)
                    const authorId = await tUtils.getAuthorId(textUUId)

                    if(authorId !== id){
                        let messagesSent = 0
                        messages.forEach(m => {
                            if(m.author.id === id){
                                messagesSent++
                            }
                        })

                        if(messagesSent === 1){
                            const reply = "Pour faire valider ton commentaire, rien de plus simple ! Ecris ta critique normalement puis fais la commande </commentaire:1079667861775192126> **après** avoir terminé ton commentaire, à la suite et dans ce chat."
                            await message.reply(reply)

                        }

                    }

                }

                /*
                if(await mUtils.exists(id)){

                    if(! await mUtils.hasTutoId(id, 1)){
                        await mUtils.addTutoId(id, config.tutoIds.commentaire)

                    }

                }
                 */

            }

        }else{


            //messages disboard
            if(id === 302050872383242240){
                console.log("bump command")

                if(message.embeds[0].data.description.includes('Bump effectué !')){
                    const recall = new Date()
                    recall.setHours(('0' + (recall.getHours() + 2)).slice(-2))
                    recall.setMinutes(('0' + (recall.getMinutes() + 30)).slice(-2))
                    console.log(recall)

                    await setBumpDate(recall)
                }

            }

        }

	}

}
