import {DbObject, sequelize} from "../dbManager";
import {DataTypes} from "sequelize";

export class Sprinters extends DbObject{

    constructor(id=null) {
        super(id)
    }

    tab = sequelize.define('sprinters', {
        userId: DataTypes.BIGINT,
        sprint: DataTypes.UUID,
        join: DataTypes.DATE

    })

}