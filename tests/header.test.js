const initPage = require("./helpers/page");

let page;

beforeEach(async ()=>{
    page = await initPage();
    await page.goto("http://localhost:3000");
})

afterEach(async ()=>{
    await page.browser_close();
})

test("the brand logo should contain the correct text", async ()=>{
    const brandLogoText = await page.getInnerText("a.brand-logo");
    expect(brandLogoText).toEqual("Blogster");
})

test("should redirect to Google on clicking login", async ()=>{
    await page.click(".right a");
    const url = await page.url();
    expect(url).toContain("accounts.google.com");
})

test("should show Logout button when logged in", async ()=>{
    await page.login();
    const logoutText = await page.getInnerText("a[href='/auth/logout']");
    expect(logoutText).toEqual("Logout");
})