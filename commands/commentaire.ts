import { SlashCommandBuilder, ActionRowBuilder, GuildMember } from "discord.js"
import { client } from ".."
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"
import { Text } from "../db/dbObjs/Text"
import { Extract } from "../db/dbObjs/Extract"

export class commentaire extends Cmd{

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
            .setName('commentaire')
            .setDescription('Offffficialiiiise un commentaire')

    }

    async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        const postId = this.inter.channel.id
        const extract = new Extract(Extract.getIdByPostId)
        const member = this.inter.member as GuildMember
        const id = member.id

        if(!extract.id){
            const postChannel = await client.channels.fetch(c.channels.textForum)
            await mes.interError(this.inter, `Va dans le channel associé au texte pour poster ton ${postChannel} \n Et si ce poste est fermé c'est que l'auteur a retiré son texte`)
            return
        }

        if(await memberOpinionExist(extract.id, id)){
            await mes.interError(this.inter, "Tu as déjà commenté ce texte ! Si des mises à jours importantes du texte méritent un nouveau retour demande à l'auteur d'effacer son ancien texte et de le reposter et pas d'utiliser /repost, en effet ce la permet de mettre au courrant tout le monde que leurs commentaire comptent à nouveau ! :D")
            return
        }

        let words = extract.getWords()
        words = Math.floor(words/1000)

        let fileUrl = await getFileMes(extract.id)
        fileUrl = fileUrl.url

        const uuid  = uuidCreate.v4()

        const embed =
            mes.newEmbed()
                .setAuthor({
                    name: `Avis de ${words} Plumes`,
                    iconURL: member.displayAvatarURL(),
                    url: fileUrl })
                .setDescription(`Par ${member} \n\n||${uuid}||`)

        const refuseButton = require("../buttons/opinionReject").get(uuid)
        const validButton = require("../buttons/opinionValid").get(uuid)
        const buttons = new ActionRowBuilder()
            .setComponents(validButton, refuseButton)

        const message = await this.inter.channel.send({ content: `<@&${c.roles.staff}>`, embeds: [embed], components: [buttons] })

        await createOne(uuid, words, textUUID, id, message.id)

        if(await getAuthorId(textUUID) === id){
            await mes.interSuccess(this.inter, "Tu as du culot toi, je respecte l'audace, bonne chance")

        }else{
            await mes.interSuccess(this.inter)

        }

    }

}
