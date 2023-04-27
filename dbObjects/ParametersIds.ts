import {DbObject} from "../dbManager";
import {sequelize} from "../index";
import {DataTypes} from "sequelize";

export class ParametersIds extends DbObject{
    sequelize = sequelize.define('parametersIds', {
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