const redis = require("redis");

class Cache{

    constructor(){
        this.ttl = 0.1;
        this.client = redis.createClient();
        this.connectToClient();
    }

    async connectToClient(){
        await this.client.connect();
    }

    async get(...keys){
        keys = keys.map(String);
        const getFn = keys.length > 1 ? this.client.hGet : this.client.get;
        let result = await getFn.call(this.client, ...keys);
        if(result){
            result = JSON.parse(result);
            if(result.created && this.ttl && ((Date.now() - result.created) > (this.ttl * 60 * 1000))){
                this.clear(...keys);
                result = null;
            }else{
                result = result.value;
            }
        }
        return result;
    }

    async has(...keys){
        const result = await this.get(...keys);
        return !!result;
    }

    set(...keysAndValue){
        const value = JSON.stringify({
            value: keysAndValue.pop(),
            created: Date.now()
        });
        const keys = keysAndValue.map(String);
        const setFn = keys.length > 1 ? this.client.hSet : this.client.set;
        return setFn.call(this.client, ...keys, value);
    }

    clear(...keys){
        keys = keys.map(String);
        const delFn = keys.length > 1 ? this.client.hDel : this.client.del;
        return delFn.call(this.client, ...keys);
    }
}

module.exports = new Cache;