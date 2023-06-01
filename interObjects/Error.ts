export class error {
    public errorId: any
    public lvl: any
    public customMes: any

    constructor(errorId=null, lvl=0, customMes={ content: null, embeds: null, components: null }) {
        this.errorId = errorId
        this.lvl = lvl
        this.customMes = customMes
    }

}