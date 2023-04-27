import {DataTypes} from "sequelize";
import {Tab, db} from "../dbManager";

export class ParametersDates extends Tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('parametersDates', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        date: DataTypes.DATE
    })

}