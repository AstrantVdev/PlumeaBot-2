import {DataTypes} from "sequelize";
import {Tab, db} from "../dbManager";

export class ParameterDate extends Tab{

    constructor(id=null) {
        super(id)
    }

    getTab = db.define('parametersDates', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        date: DataTypes.DATE
    })

}