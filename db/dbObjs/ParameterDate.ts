import {DataTypes} from "sequelize"
import { Item } from "../Item"

export class ParameterDate extends Item{

    constructor(id=null) {
        super(id)
    }

    static tab = this.db.define('parametersDates', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        date: DataTypes.DATE
    })

}