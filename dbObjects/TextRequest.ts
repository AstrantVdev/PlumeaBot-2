import {DbObject} from "../dbManager";
import {sequelize} from "../index";
import {DataTypes} from "sequelize";

export class textRequest extends DbObject{
    sequelize = sequelize.define('textRequest', {
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

    constructor() {
        super();
    }
}