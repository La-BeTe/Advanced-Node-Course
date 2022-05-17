const puppeteer = require("puppeteer");
let browser, page;

async function logIn(){
    const sessionStr = JSON.stringify({
        passport: {
            user: process.env.TEST_USER_ID
        }
    })
    const base64SessionStr = Buffer.from(sessionStr).toString("base64");
    const Keygrip = require("keygrip");
    const keygripInstance = new Keygrip(String(process.env.COOKIE_KEY).split(","));
    const signature = keygripInstance.sign(`session=${base64SessionStr}`);
    await page.setCookie(
        {
            name: "session",
            value: base64SessionStr
        },
        {
            name: "session.sig",
            value: signature
        }
    )
    await page.reload();
    await page.waitForSelector(".right a");
}

beforeAll(async ()=>{
    browser = await puppeteer.launch({
        headless: false
    });
})

beforeEach(async ()=>{
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
})

afterEach(async ()=>{
    await page.close();
})

afterAll(async ()=>{
    await browser.close();
})

test("the brand logo should contain the correct text", async ()=>{
    const brandLogoText = await page.$eval("a.brand-logo", el=> el.innerText);
    expect(brandLogoText).toEqual("Blogster");
})

test("should redirect to Google on clicking login", async ()=>{
    await page.click(".right a");
    const url = await page.url();
    expect(url).toContain("accounts.google.com");
})

test("should show Logout button when logged in", async ()=>{
    await logIn();
    const logoutText = await page.$eval("a[href='/auth/logout']", el=> el.innerText);
    expect(logoutText).toEqual("Logout");
})