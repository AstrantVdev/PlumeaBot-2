const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const mUtil = require('../utils/member')
const mes = require("../utils/message")

module.exports = {
	data(){
        return new SlashCommandBuilder()
            .setName('check-inactives')
            .setDescription('Renvoie une liste des membres sans point et présents depuis au moins un mois')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    },

    async execute(inter) {
        let inactivesIds = await mUtil.getInactivesIds()

        if(inactivesIds.length > 0){
            const menu = await require("../selectMenus/inactivesCheck").get(inactivesIds, inter)

            if(menu){
                await mes.interSuccess(inter, { content: "ca dégage", components: menu })
                return
            }


        }

        await mes.interSuccess(inter, "Il n'en reste aucun mouhahaha !")

    }

}