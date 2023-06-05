import { SlashCommandBuilder } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"


export class sprint extends Cmd{

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
        .setName('sprint')
        .setDescription('Bah Sprint... O.o')

    }

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        const channelId = inter.channel.id

        if(await sUtils.isChannel(channelId)){

            await mes.interSuccess(inter, require("../modals/sprintBegin").get())


            /*

            if(! await sUtils.isSprinting(0)){
                await mes.interSuccess(inter, require("../modals/sprintBegin").get())

            }else{
                const message = await mes.getMes(config.channels.sprint, await sUtils.getMessageId(0))
                await mes.interSuccess(
                    inter,
                    {
                        content: "Un sprint est déjà en cours, rejoins le :",
                        components: [require("../buttons/link").get(message.url)]
                    })
            }
            */

        }else{
            await mes.interError(inter,'Mauvais salon, va dans <#' + c.channels.sprint + ">")
        }
    
    }

}