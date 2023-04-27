import {DbObject, sequelize} from "../dbManager";
import {DataTypes} from "sequelize";

export class ParametersIds extends DbObject{
    tab = sequelize.define('parametersIds', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        paramId: DataTypes.BIGINT

    })

    constructor() {
        super();
    }
}