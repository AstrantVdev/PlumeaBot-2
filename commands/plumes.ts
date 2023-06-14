import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"


export class plumes extends Cmd{

    constructor(inter) {
        super(inter)
    }

    /**
     * where is defined the cmd
     * 
     * @returns SlashCommandBuilder with all cmd infos, name, desc, args, etc...
     */
    static get(){
        return new SlashCommandBuilder()
            .setName('plumes')
            .setDescription('Ajoute un nombre de plumes à un' + c.string.inhab + ', négatif ou positif, au choix')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addUserOption(option => option
                .setName('user')
                .setDescription('Utilisateur')
                .setRequired(true))
            .addIntegerOption(option => option
                .setMinValue(-99)
                .setMaxValue(99)
                .setName('plumes')
                .setDescription('Nombre de Plumes à rajouter/enlever')
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("La raison d'ajout des plumes"))

    }

    async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        const user = inter.options.getMember('user')
        let p = inter.options.getInteger('plumes')

        let reason = "Plumes ajoutées à la main"
        const userReason = inter.options.getString('reason')
        if (userReason) {
            reason = userReason
        }

        await inter.deferReply({ ephemeral: true })

        if(await m.exists(user.id)){
            await oUtils.confirm(user, p, reason, inter.member, inter)

            await mes.interSuccess(inter, null, true)

        }else{
            await mes.interError(inter, "Cet utilisateur n'est pas enregistré dans la db !", 1)

        }
                
    }

}