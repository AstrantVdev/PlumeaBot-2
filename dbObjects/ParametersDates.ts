import {DataTypes} from "sequelize";
import {tab, db} from "../dbManager";

export class ParametersDates extends tab{

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