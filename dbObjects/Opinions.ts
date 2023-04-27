import {DbObject} from "../dbManager";
import {sequelize} from "../dbManager";
import {DataTypes, Sequelize} from "sequelize";

export  class Opinions extends DbObject{
    sequelize = sequelize.define('opinions', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true
        },
        textId: DataTypes.UUID,
        words: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        messageId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        senderId: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        },
        validate: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
        }

    })

    constructor() {
        super();
    }

}