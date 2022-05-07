const redis = require("redis");

class Cache{
    constructor(){
        this.client = redis.createClient();
        this.client.connect();
    }

    async get(key){
        key = String(key);
        let result = await this.client.get(key);
        if(result){
            result = JSON.parse(result);
        }
        return result;
    }

    async has(key){
        key = String(key);
        let result = await this.client.get(key);
        return !!result;
    }

    set(key, value){
        key = String(key);
        value = JSON.stringify(value);
        return this.client.set(key, value);
    }
}

module.exports = new Cache()