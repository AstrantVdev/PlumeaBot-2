const tab =  require('../dbObjects')
const mes =  require('../utils/message')
const config = require("../config").config

module.exports = {

    async createWeeklyResetTime(){
        const date = new Date()
        date.setDate(date.getDate() + 7)
        await tab.tabCreate(PDATES_TAB, {
            id: 'weeklyResetDate',
            date: date
        })

    },

    checkIntegerModalInput(input, inputName, max = 666666666, min = 0){
        let errorMes = ''

        if(isNaN(input)) {
            errorMes += inputName + " : Ce n~est pas un nombre que tu as donné là !\n"

        }else{

            if(input < min){
                errorMes += inputName + " : C'est un nombre en dessous de " + min + " ca !\n"

            }

            if(input > max){
                errorMes += inputName + " : C'est un nombre en dessus de " + max + " ca !\n"

            }

            if((input - Math.floor(input)) !== 0){
                errorMes +=  inputName + " : Pas de nombre à virgule stp -_-\n"
            }

        }

        return errorMes

    },

    async isWeeklyResetTime(){
        const today = new Date()
        const resetDay = await this.getWeeklyResetDate()

        return today > resetDay

    },

    async getWeeklyResetDate(){
        return await tab.tabGetAtr(PDATES_TAB, 'weeklyResetDate', 'date')
    },

    async setWeeklyResetDate(){
        const date = new Date()
        date.setDate(date.getDate() + 7)
        await tab.tabSetAtr(PDATES_TAB, 'weeklyResetDate', 'date', date)
    }, 

    async isWeeklyResetDate(){
        return tab.tabExist(PDATES_TAB, 'weeklyResetDate')
    },

    async createBumpDate(){
        const date = new Date()
        date.setHours(date.getHours() + 2)
        await tab.tabCreate(PDATES_TAB, {
            id: 'bumpDate',
            date: date
        })
    },

    async getBumpDate(){
        return tab.tabGetAtr(PDATES_TAB, 'bumpDate', 'date')
    },

    async setBumpDate(date = new Date()){
        date.setHours(date.getHours() + 2)

        await tab.tabSetAtr(PDATES_TAB, 'bumpDate', 'date', date)
    }, 

    async isBumpDate(){
        return tab.tabExist(PDATES_TAB, 'bumpDate')
    },

    async memberCheckRoles(m, roles){
        const mRoles = await m.roles.cache
        const rolesIds = mRoles.map(r => { return r.id })

        let yes = false
        roles.forEach(r => {
            yes |= rolesIds.includes(r)
        })

        return yes

    },

    plumesRolesSet(member, plumes, inter) {
        const json = config.plumesRoles
        const roles = new Map(Object.entries(json))
        
        let found =  false
        let lower = 0
        let roleBefore = 0
        roles.forEach(async (args, rId)=>{
            const points = args.p
            const role = await inter.guild.roles.cache.get(rId)

            if(await member.roles.cache.find(r => r.id === rId)){ roleBefore = role }

            await member.roles.remove(role)

            if (points <= plumes) {
                lower = role

            }else{

                if(!found && lower !== 0){
                    found = true

                    await member.roles.add(lower)

                    if(roleBefore !== lower){
                        const color = config.plumesRoles[lower.id].color

                        const privEmbed = mes.newEmbed(color)
                            .setTitle("Félicitations ! Vous voici `" + lower.name + "`.")
                            .setDescription(config.plumesRoles[lower.id].mes)
                        const sent = await mes.private(member, { embeds: [privEmbed] })

                        const channel = config.channels.plumes
                        const embed = mes.newEmbed(color)
                            .setDescription(`Félicitations ! ${member} accède au rang de  ${lower}`)
                        await mes.sendMes(channel, { embeds: [embed] })

                        if(! sent){
                            await mes.sendMes(channel, { content: `<@${member.id}> Si tu souhaites recevoir ce message en privé, ouvre tes messages privés :`, embeds: [privEmbed] })

                        }

                    }                

                } 

            }

        })

    }

}