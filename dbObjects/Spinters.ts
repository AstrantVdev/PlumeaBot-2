import {tab, db} from "../dbManager";
import {DataTypes} from "sequelize";

export class Sprinters extends tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('sprinters', {
        userId: DataTypes.BIGINT,
        sprint: DataTypes.UUID,
        join: DataTypes.DATE

    })

}