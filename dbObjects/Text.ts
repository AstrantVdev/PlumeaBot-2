
import {Tab, db} from "../dbManager"
import {DataTypes, Op} from "sequelize"

export class Texts extends Tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('texts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
        },
        desc: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        authorId: {
            type: DataTypes.STRING,
            defaultValue: 0
        },
        words: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        extracts: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        }

    })

    async add(text) {
        await this.create(text)
    }

}