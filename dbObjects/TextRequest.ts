import {DbObject, sequelize} from "../dbManager";
import {DataTypes} from "sequelize";

export class textRequest extends DbObject{

    constructor(id=null) {
        super(id)
    }

    tab = sequelize.define('textRequest', {
        mesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            primaryKey: true,
            unique: true
        },
        textId: DataTypes.UUID,
        senderId: DataTypes.BIGINT,
        date: DataTypes.DATE,
        state: {
            type: DataTypes.STRING,
            defaultValue: "WAIT"
        }

    })

}