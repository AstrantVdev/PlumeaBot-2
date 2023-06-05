/**
 * an interaction error object
 */
export class InterError {
    /**
     * @param errorId id to retrieve error inside json config
     */
    public errorId: string
    /**
     * @param lvl error's gravvity level
     */
    public lvl: number
        /**
     * @param customMes message with content, components or files to be log and send to user
     */
    public customMes: any

    constructor(errorId=null, lvl=0, customMes={ content: null, embeds: null, components: null }) {
        this.errorId = errorId
        this.lvl = lvl
        this.customMes = customMes
    }

}