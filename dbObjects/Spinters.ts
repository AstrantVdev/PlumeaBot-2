import {DbObject} from "../dbManager";
import {sequelize} from "../index";
import {DataTypes} from "sequelize";

export class Sprinters extends DbObject{
    sequelize = sequelize.define('sprinters', {
        userId: DataTypes.BIGINT,
        sprint: DataTypes.UUID,
        join: DataTypes.DATE

    })

    constructor() {
        super();
    }
}