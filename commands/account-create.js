const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const m =  require('../utils/member')
const mes = require('../utils/message')

module.exports = {
	data(){
        let data = new SlashCommandBuilder()
        .setName('account-create')
        .setDescription('Crée un compte pour un utilisateur')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option
            .setName('user')
            .setDescription('Utilisateur')
            .setRequired(true))

        return data
    }, 

	async execute(inter) {
        const user = inter.options.getUser('user')

        if(! await m.exists(user.id)){
            await m.addMember(user.id)
            await mes.interSuccess(inter)

        }else{
            await mes.interError(inter, "Cet utilisateur existe déja !")
        }

	}

}