import {DataTypes} from "sequelize";
import {DbObject, sequelize} from "../dbManager";

export class ParametersDates extends DbObject{
    tab = sequelize.define('parametersDates', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        date: DataTypes.DATE
    })

    constructor() {
        super();
    }

}