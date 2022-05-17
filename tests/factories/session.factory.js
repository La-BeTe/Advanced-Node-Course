const Keygrip = require("keygrip");
const keygripInstance = new Keygrip(String(process.env.COOKIE_KEY).split(","));


module.exports = function(user){
    const sessionStr = JSON.stringify({
        passport: {
            user: user.id
        }
    })
    const session = Buffer.from(sessionStr).toString("base64");
    const signature = keygripInstance.sign(`session=${session}`);
    return { session, signature }
}