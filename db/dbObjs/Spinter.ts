import {DataTypes} from "sequelize";
import { Item } from "../Item";

export class Sprinter extends Item{
    userId: string
    sprintId: string
    joinDate: Date
    beginWords: number
    endWords: number

    constructor(id=null) {
        super(id)
    }

    static tab = this.db.define('sprinters', {
        userId: DataTypes.STRING,
        sprintId: DataTypes.UUID,
        joinDate: DataTypes.DATE,
        beginWords: DataTypes.INTEGER,
        endWords: DataTypes.INTEGER

    })

}