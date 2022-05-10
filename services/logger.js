const Logs = require("../models/Log")

class Logger{

    error(key, ...value){
        const error = value[0];
        if(error instanceof Error){
            value.push({
                message: error.message,
                stack: error.stack
            })
        }
        this.#log("error", key, value);
    }

    info(key, ...value){
        this.#log("info", key, value);
    }

    #log(type, key, value){
        if(!Array.isArray(value)) value = [value];
        value.push(new Date());
        Logs.create({
            key: String(key),
            type: String(type), 
            value: JSON.stringify(value)
        })
    }
}

module.exports = new Logger;