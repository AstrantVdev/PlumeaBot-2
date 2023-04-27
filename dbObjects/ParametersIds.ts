import {tab, db} from "../dbManager";
import {DataTypes} from "sequelize";

export class ParametersIds extends tab{

    constructor(id=null) {
        super(id)
    }

    tab = db.define('parametersIds', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
        },
        paramId: DataTypes.BIGINT

    })

}

export const parameter = {
    weeklyPlumes: "weeklyPlumes",
    plumesTotal: "plumesTotal"
}