import { SlashCommandBuilder, PermissionsBitField } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"


export class unpost_all extends Cmd{

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
            .setName('unpost-all')
            .setDescription("Enlève TOUS LES POSTS d'un utilisateur, pas les commentaire")
            .addUserOption(option => option
                .setName("user")
                .setDescription("L'utilisateur qui va perdre tout ses textes postés"))
            .addStringOption(option => option
                .setName("id_title")
                .setDescription("L'id du texte ex : MANIKA")
                .setMinLength(6)
                .setMaxLength(6))

    }

    async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        const user = inter.user
        let userId = user.id

        try{
            userId = inter.options.getUser("user").id

            if(!user.permissions.has(PermissionsBitField.Administrator)){
                await mes.interError(inter, "Il faut être admin pour spécifier l'utilisateur ! Ne spécifie aucun paramètre pour que la commande agisse sur ton compte ;")

            }
        }catch(e){}

        let where = { authorId: userId }

        try{
            where.id_text_title = inter.options.getString("id_title")

        }catch(e){}

        const textsUUIDs = await T_TAB.findOne({ where: where, attributes: ['textsUUIDs'], raw: true })

        if(textsUUIDs.length !== 0){

            await textsUUIDs.forEach(async uuid => {
                await t.vanish(uuid)
            })

            await m.removeAllTextsUUIDs(userId)

            await mes.interSuccess(inter)

        }else{
            await mes.interError(inter, "Aucun texte trouvé, l'id_title est peut-etre erroné")

        }

    }

}