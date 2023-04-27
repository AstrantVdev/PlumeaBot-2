const { c } = require('../config')
const mes =  require('../utils/message')
const { getAllIdsPlumes } = require('../utils/member')

module.exports = {
    async edit(){
        const channelId = c.channels.leaderboard
        const mesId = c.messages.leaderboard

        await mes.editMes(channelId, mesId, {content:'', embeds: [await this.create()]} )

    },

    async create(){
		const members = await getAllIdsPlumes()
        let winnersPlumes = []
        let winnersId = []

        members.forEach(m => {
            const plumes = m[1]
            let higher = true
            const l = winnersPlumes.length

            for (let i = 0 ; i < l ; i++) {

                if(plumes < winnersPlumes[i]){

                    for (let o = l ; o > i ; o--) {
                        winnersPlumes[o] = winnersPlumes[o-1]
                        winnersId[o] = winnersId[o-1]
                    }

                    winnersPlumes[i] = plumes
                    winnersId[i] = m[0]

                    higher = false
                    break
                }

            }

            if (higher){
                winnersPlumes.push(plumes)
                winnersId.push(m[0])
            }

        })

        let message = '\n'
        const l = winnersId.length
        for(let i = l-1 ; (i >= l-10 && i >= 0) ; i--){
            const id = winnersId[i]

            let m = ''
            if(i === l-1){
                m += ':first_place: '
            }else if(i === l-2){
                m += ':second_place: '
            }else if(i === l-3){
                m += ':third_place: '
            }

            message+= m+'<@'+id+'>: ' + winnersPlumes[i]+'\n---\n'

        }

        return mes.newEmbed()
            .setTitle('LEADERBOARD :')
            .setDescription(message)

    }

}