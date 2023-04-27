import path = require("path")
import * as fs from "fs"
import {DIRNAME} from "./index";

export function getAllFilesInDir(dir, files=[]){
    const itemsPath = path.join(DIRNAME, dir)

    for(const file of fs.readdirSync(itemsPath)){

        if(file.endsWith(".ts")){
            files.push(path.join(DIRNAME, file))

        }else{
            this.getAllFile(path.join(dir, file))
        }

    }

    return files

}