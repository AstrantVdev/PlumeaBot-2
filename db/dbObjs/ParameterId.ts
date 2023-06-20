import {DataTypes} from "sequelize"
import { Item } from "../Item"

export class ParameterId extends Item{

    constructor(id=null) {
        super(id)
    }

    static tab = this.db.define('parametersIds', {
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