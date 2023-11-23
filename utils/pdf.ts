const p = import("pdfreader")
const path = require("path")
let request = require(`request`)
let fs = require(`fs`)

module.exports = {

    async countWords(file){
        /*
        file_path = "uwu.pdf"

        request.get(file.url)
            .pipe(fs.createWriteStream(file_path))

        console.log(";3")
        file = fs.readFileSync(file_path)
        let data = await pdf(file)
        console.log(";3")

        data = data.text
        data = data.replace(/(^\s*)|(\s*$)/gi,"")
        data = data.replace(/[ ]{2,}/gi," ")
        data = data.replace(/\n /,"\n")
        console.log(";3")

        l = data.split(" ").length
        console.log(";3")
        */

        let test = request.get(file.url)
        request({url:file.url, encoding:null}, async function (error, response, pdfBuffer) {

            new (await p).PdfReader({ debug: true }).parseBuffer(pdfBuffer, (err, item) => {
                if (item && item.text){
                    console.log("o")
                    let text = item.text
                    text = text.replace(/(^\s*)|(\s*$)/gi,"")
                    text = text.replace(/[ ]{2,}/gi," ")
                    text = text.replace(/\n /,"\n")
                    return text.split(" ").length
                }
            })

        })

    },

    rename(file, name){
        Object.defineProperty(file, 'name', {
            writable: true,
            value: name + this.getExtension(file)
        })
    },

    checkExtension(file, extensionDesired){
        const extension = this.getExtension(file)
        return extension === '.' + extensionDesired
    },

    getExtension(file){
        return path.extname(file.name)
    }

}