const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });
  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My title');
      await page.type('.content input', 'My content');
      await page.click('form button');
    });
    test('submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('submitting then saving adds blog to index screen', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My title');
      expect(content).toEqual('My content');
    });
  });

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('form shows error message', async () => {
      const titleErr = await page.getContentsOf('.title .red-text');
      const contentErr = await page.getContentsOf('.content .red-text');

      expect(titleErr).toEqual('You must provide a value');
      expect(contentErr).toEqual('You must provide a value');
    });
  });
});

describe('user not logged in ', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: { title: 'T', content: 'C' }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);

    for (result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
  // test('user cannot create blog post', async () => {
  //   const result = await page.post('/api/blogs', { title: 'T', content: 'C' });
  //   // console.log(result);
  //   expect(result).toEqual({ error: 'You must log in!' });
  // });
  //
  // test('user cannot get a list of posts', async () => {
  //   const result = await page.get('/api/blogs');
  //
  //   // console.log(result);
  //   expect(result).toEqual({ error: 'You must log in!' });
  // });
});
