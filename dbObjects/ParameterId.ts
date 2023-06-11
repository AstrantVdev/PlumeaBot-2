import {Tab, db} from "../dbManager";
import {DataTypes} from "sequelize";

export class ParameterId extends Tab{

    constructor(id=null) {
        super(id)
    }

    getTab = db.define('parametersIds', {
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