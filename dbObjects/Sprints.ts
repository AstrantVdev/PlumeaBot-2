import {DbObject, sequelize} from "../dbManager";
import {DataTypes} from "sequelize";

export class Sprint extends DbObject{

    constructor(id=null) {
        super(id)
    }

    tab = sequelize.define('sprints', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true
        },
        end: DataTypes.DATE,
        waitEnd: DataTypes.DATE,
        sprinters: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        messageId: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        time: DataTypes.INTEGER,
        state: DataTypes.STRING

    })

}