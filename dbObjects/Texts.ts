
import {DbObject, sequelize} from "../dbManager";
import {DataTypes} from "sequelize";

export class Text extends DbObject{

    constructor(id=null) {
        super(id)
    }

    tab = sequelize.define('texts', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
        },
        id_text_title: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        id_text: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        desc: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        authorId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        chap1: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        chap2: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        words: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        textMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        fileMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        postId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        postMesId: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        protected: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        themes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        questions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        }

    })

}