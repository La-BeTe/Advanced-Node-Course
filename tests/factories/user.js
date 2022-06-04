const User = require("../../models/User");

module.exports = async function(){
    const user = await User.create({});
    return user.toObject();
}