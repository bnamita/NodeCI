// const puppeteer = require('puppeteer');
const Page = require('./helpers/page');

// let browser; removing this as we no longer require browser. We added that functionality to page proxy
let page;

beforeEach(async () => {
  // browser = await puppeteer.launch({
  //   headless: false
  // });
  // page = await browser.newPage();
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
  // await browser.close();
});

test('Can launch a browser', async () => {
  // const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('when signed in, shows logout button', async () => {
  // const id = '5cb8687835298b1166f8760a';
  await page.login();

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
});
