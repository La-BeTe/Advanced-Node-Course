const mongoose = require("mongoose");
const cache = require("./cache");
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache= function(cacheKey = "default"){
    this.cacheKey = String(cacheKey);
    return this;
}
mongoose.Query.prototype.exec = async function(...args){
    if(!this.cacheKey) return exec.call(this, ...args);
    const key = `${this.mongooseCollection.name}${JSON.stringify(this.getQuery())}`;
    let result = await cache.get(this.cacheKey, key);
    if(result){
        return Array.isArray(result) 
                ? result.map(r=> new this.model(r)) 
                : new this.model(result);
    }
    result = await exec.call(this, ...args);
    await cache.set(this.cacheKey, key, result);
    return result;
}