/**
 * Abstract Class Animal.
 *
 * @class Cmd
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')


class Cmd {
    errorMes = ''

    constructor() {
        if (this.constructor === Cmd) {
            throw new Error("Abstract classes can't be instantiated.")
        }
    }

    data() {
        throw new Error("Method 'data()' must be implemented.")
    }

    exe() {
        throw new Error("Method 'exe()' must be implemented.")
    }

    error() {
        console.log("eating")
    }

    success() {
        console.log("eating")
    }
    
}


/**
 * Dog.
 *
 * @class Dog
 * @extends {Animal}
 */
class Dog extends Cmd {
    exe() {
        console.log("bark");
    }
}
