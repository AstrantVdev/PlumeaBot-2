import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Member } from "../dbObjects/Member"
import { Cmd } from "../interObjects/Cmd"

/**
 * send a list of inactive members
 */
export class check_inactives extends Cmd{

    public constructor(inter) {
        super(inter)
    }

    /**
     * where is defined the cmd
     * 
     * @returns SlashCommandBuilder with all cmd infos, name, desc, args, etc...
     */
    public static get(){
        return new SlashCommandBuilder()
            .setName('check-inactives')
            .setDescription('Renvoie une liste des membres sans point et présents depuis au moins un mois')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    }

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        let inactivesIds = await Member.getInactivesIds()

        if(inactivesIds.length > 0){
            const menu = await require("../selectMenus/inactivesCheck").get(inactivesIds, this.inter)

            if(menu){
                await mes.interSuccess({ content: "ca dégage", components: menu })
                return
            }


        }

        errors.push()
        await mes.interSuccess("Il n'en reste aucun mouhahaha !")

    }

}