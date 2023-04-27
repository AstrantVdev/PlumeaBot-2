import {DbObject} from "../dbManager";
import {sequelize} from "../index";
import {DataTypes} from "sequelize";

export class Member extends DbObject{

    public sequelize = sequelize.define('members', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            unique: true
        },
        nick: {
            type: DataTypes.STRING,
            defaultValue: 'o'
        },
        joinDate: DataTypes.DATE,
        textsUUIDs: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        medals: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        cards: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            defaultValue: []
        },
        plumes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        coins: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        weeklyWords: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fileInPostingMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        textInPostingUUID: DataTypes.UUID,
        tutoIds: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        }

    })

    constructor() {
        super()
    }

}