import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"
import { Inter } from "../interObjects/Inter"
import { InterError } from "../interObjects/InterError"


export class check_inactives extends Inter{
    
    constructor() {
        super()
    }

    /**
     * where is defined the cmd
     * 
     * @returns SlashCommandBuilder with all cmd infos, name, desc, args, etc...
     */
    get(){
        return new SlashCommandBuilder()
            .setName('check-inactives')
            .setDescription('Renvoie une liste des membres sans point et présents depuis au moins un mois')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    }

    public async customExe(inter : CommandInteraction, errors : Array<InterError>, customReply, args) : Promise<void> {
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