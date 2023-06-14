/**
 * an interaction error object
 */
export class InterError {
    errorId: string
    lvl: number
    customMes: any

    /**
     * @param errorId id to retrieve error inside json config
     * @param lvl error's gravvity level
     * @param customMes a simple string to fill error message embed | some components or embeds or content to fill the error message
     */
    constructor(errorId: string=null, lvl: number=0, customMes: any={ content: null, embeds: null, components: null }) {
        this.errorId = errorId
        this.lvl = lvl
        this.customMes = customMes
    }

}