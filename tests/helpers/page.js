const puppeteer = require("puppeteer");
const createUser = require("../factories/user");
const createSession = require("../factories/session");

class CustomPage{
    constructor(browser, page){
        this.browser = browser;
        this.page = page;
    }

    async login(){
        const user = await createUser();
        const { session, signature } = createSession(user);
        await this.page.setCookie(
            {
                name: "session",
                value: session
            },
            {
                name: "session.sig",
                value: signature
            }
        )
        await this.page.reload();
        await this.page.waitForSelector(".right a");
    }
    getInnerText(selector){
        return this.page.$eval(String(selector), el=> el.innerText);
    }
}

module.exports = async function(){
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(browser, page);
    return new Proxy(customPage, {
        get: function(target, prop){
            let newTarget = target;
            let value = target[prop];
            if(!value && target.page){
                newTarget = target.page;
                value = target.page[prop];
            }
            const browserIdentifier = "browser_";
            if(prop.startsWith(browserIdentifier)){
                prop = prop.replace(browserIdentifier, "");
                newTarget = target.browser;
                value = target.browser[prop];
            }
            if(typeof value === "function"){
                return value.bind(newTarget)
            }
            return value;
        }
    })
}