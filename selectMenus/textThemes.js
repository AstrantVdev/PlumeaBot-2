const { ActionRowBuilder, StringSelectMenuBuilder  } = require('discord.js')
const tUtils = require("../utils/text")
const mes = require("../utils/message")
const { config } =  require("../config")

module.exports = {
    name: 'textThemes',

    async execute(inter){
        const split = inter.customId.split('/')
        const textUUID = split[1]
        const textModelUUID = split[2]
        const PostProcess = split[3]

        const themes = inter.values
        await tUtils.setThemes(textUUID, themes)

        if(PostProcess === '1'){
            const button = require("../buttons/textModal2").get(textUUID, textModelUUID, PostProcess)
            await mes.interSuccess(inter, { content: "Titre en entier, ID_chapitres, et description \n __Appuis sur le bouton__  ↓↓↓", components: [button] })

        }else{
            const postChannelId = await tUtils.getPostId(textUUID)
            const postChannel = await client.channels.fetch(postChannelId)

            await postChannel.setAppliedTags(tUtils.getThemesIdsByNames(themes))

            await mes.interSuccess(inter)
        }

    },

    async get(textUUID, textModelUUID, postProcess){
        let menu = new StringSelectMenuBuilder()
            .setCustomId(this.name + "/" + textUUID + "/" + textModelUUID + "/" + postProcess)
            .setPlaceholder('Choisis les thèmes de ton texte')
            .setMinValues(1)
            .setMaxValues(3)

        let defaultThemes = []
        if(textModelUUID !== '0'){
            defaultThemes = await tUtils.getThemes(textModelUUID)
        }

        const themes = config.themes
        themes.forEach(t => {
            let option = { label: t.name, description: t.desc, value: t.name }
            /*
            if(defaultThemes.includes(t.name)){
                option.default = true
            }
             */
            menu.addOptions(option)

        })



        return new ActionRowBuilder()
            .setComponents(menu)


    }

}