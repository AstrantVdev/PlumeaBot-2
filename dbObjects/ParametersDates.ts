import {sequelize} from "../dbManager";
import {DataTypes} from "sequelize";
import {DbObject} from "../dbManager";

export class ParametersDates extends DbObject{
    sequelize = sequelize.define('parametersDates', {
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