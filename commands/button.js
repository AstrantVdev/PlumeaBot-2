const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const mes = require('../utils/message')
const path = require('node:path')
const fs = require('node:fs')

module.exports = {
	data(){
        let data = new SlashCommandBuilder()
        .setName('button')
        .setDescription('Create a button')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        const buttonsPath = path.join(DIRNAME, 'buttons')
        const buttonsFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'))

        //CE NEST PAS UN ARRAY, c'est une suite d'élément json, et je ne sais pas comment une telle suite, dou la suite un peu laborieuse
        let choices = []
        for(let b of buttonsFiles){
            const bPath = path.join(buttonsPath, b)
            b = require(bPath)

            const choice = { name: b.name, value: b.name }
            choices.push(choice)
        }

        data.addStringOption(option => {
            option.setName('name')
                .setDescription('Button name')
                .setRequired(true)

            for(let i = 0 ; i < choices.length ; i++) {
                option.addChoices(choices[i])
            }

            return option
        
        })

        return data
    }, 

     async execute(inter) {
         const value = inter.options.getString('name')

         const buttonsPath = path.join(DIRNAME, 'buttons')
         const buttons = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'))

         let button
         for(let b of buttons){
             b = require(path.join(buttonsPath, b))

             if(b.name === value){
                 button = b
                 break
             }

         }
         try{
             inter.channel.send({components: [button.get()]})
             await mes.interSuccess(inter)

         }catch(Error){
             await mes.interError(inter, 'Impossible de générer ce bouton manuellement')
             console.log(Error)

         }

	}

}