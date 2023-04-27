import {Tab, db} from "../dbManager";
import {DataTypes} from "sequelize";

export class Sprinters extends Tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('sprinters', {
        userId: DataTypes.STRING,
        sprint: DataTypes.UUID,
        join: DataTypes.DATE

    })

}