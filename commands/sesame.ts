import { SlashCommandBuilder } from "discord.js"
import { InterError } from "../interObjects/InterError"
import { Cmd } from "../interObjects/Cmd"


export class sesame extends Cmd{

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
            .setName('sesame')
            .setDescription("Permet d'accéder au serveur")
            .addStringOption(option => option
                .setName('pass')
                .setDescription("Accédez à Pluméa en entrant le bon mot de passe.")
                .setRequired(true))

    }

    public async customExe(errors : Array<InterError>, customReply, args) : Promise<void> {
        const pass = inter.options.getString('pass')
        const member = inter.member
        const plumeRole = c.roles.plumeen

        if(member.roles.cache.has(plumeRole)){
            await mes.interError(inter, 'Tu fais quoi là -_-')
            return

        }else{

            if(pass === "050123"){
                await member.roles.add(plumeRole)

                let re = ''
                if(! await exists(member.id)){
                    await addMember(member.id)
                }else{
                    re = "Re"
                }

                const welcomeMessage = mes.newEmbed()
                    .setDescription(`**${re}Bienvenue sur pluméa ${member} | ${member.user.username}.**`)
                    .setAuthor({ name: 'Youpiii !',iconURL: 'https://i.imgur.com/TYeapMy.png', url: 'https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713' })
                    .setThumbnail(member.displayAvatarURL())

                const welcome = c.channels.welcome
                await mes.sendMes(welcome, { embeds: [welcomeMessage]})

                const socials =
                    "> 📕▸**"+re+"Bienvenue sur pluméa !**\n\n 🧭 ▸Le guide du Pluméen contient toutes les informations nécessaires sur le bon fonctionnement de la communauté : *règles générales, comment poster son commentaire, comment poster son texte...*\n"+
                    "https://discord.com/channels/1027089727360344144/1063760987238436924\n\n"+

                    "👤 ▸Et si vous nous en disiez plus sur vous ? \n"+
                    "https://discord.com/channels/1027089727360344144/1060681609751310336\n\n"+

                    "📖▸Postez votre texte et retrouvez ceux des membres !\n"+
                    "https://discord.com/channels/1027089727360344144/1060687578413674646\n\n"+

                    "📋▸Retrouvez un espace pour poster vos commentaires !\n"+
                    "https://discord.com/channels/1027089727360344144/1060687321579659425\n\n"+

                    "💬 ▸Passez nous dire bonjour, ne soyez pas timide !\n"+
                    "https://discord.com/channels/1027089727360344144/1060677819107115088\n\n"+

                    "📬▸Un tournois de nouvelle est organisée tous les mois. A vos plumes !\n"+
                    "https://discord.com/channels/1027089727360344144/1060679258579669083\n\n"+

                    "🎫▸Un soucis ? Une question ? L'équipe de Pluméa veille.\n"+
                    "https://discord.com/channels/1027089727360344144/1060681924877766786\n\n"+

                    "> 📸 nos réseaux :\n"+
                    "__INSTAGRAM__\n"+
                    "https://instagram.com/pluméa.fr?igshid=ZDdkNTZiNTM=\n\n"+

                    "https://imgur.com/92562no"

                const sent = await mes.privateMes(inter.member, socials)

                if(sent){
                    await mes.interSuccess(inter, re+'Bienvenue ! :D')

                }else{
                    await mes.interSuccess(inter, socials)

                }

            }else{
                await mes.interError(inter, 'Mauvais mot de passe.. Mot de passe dans la description du salon en haut')

            }

        }

    }

}