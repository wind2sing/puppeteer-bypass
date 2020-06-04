const initBrowser = require("./browser");
const { cookiesToStr } = require("./utils");
const defaultGotoOptions = {
  waitUtil: "domcontentloaded",
  timeout: 30000,
};

const defaultcloudflareHandler = (page) => {
  return page.waitForNavigation();
};

/**
 * @callback Hook
 * @param {import('puppeteer').Page} page
 * @param {import('puppeteer').Browser} browser
 */

/**
 * @callback CFHandler
 * @param {import('puppeteer').Page} page
 */

/**
 *
 *
 * @param {string} url
 * @param {Object} options
 * @param {import('puppeteer').LaunchOptions} options.launchOptions
 * @param {import('puppeteer').DirectNavigationOptions} options.gotoOptions
 * @param {boolean} [options.useStealthPlugin]
 * @param {string} [options.cloudflareMark]
 * @param {CFHandler} [options.cloudflareHandler]
 * @param {import('./browser').HookP} [options.beforeLaunchHook]
 * @param {Hook} [options.beforeGotoHook]
 * @param {Hook} [options.afterGotoHook]
 * @param {import('puppeteer').Browser} [options.browser]
 */
async function goto(
  url,
  {
    gotoOptions = {},
    browser = null,
    launchOptions,
    useStealthPlugin,
    cloudflareMark = "cf-browser-verification",
    cloudflareHandler = defaultcloudflareHandler,
    beforeLaunchHook,
    beforeGotoHook,
    afterGotoHook,
  } = {}
) {
  Object.assign(gotoOptions, defaultGotoOptions);

  // close browser in the end if it is launched in this function
  let toCloseBrowser = false;
  if (!browser) {
    browser = await initBrowser({
      launchOptions,
      useStealthPlugin,
      beforeLaunchHook
    });
    toCloseBrowser = true;
  }
  const page = await browser.newPage();

  // main work
  let body, cookies;
  try {
    if (typeof beforeGotoHook === "function") beforeGotoHook(page, browser);
    await page.goto(url, gotoOptions);
    if ((await page.content()).includes(cloudflareMark)) {
      if (typeof cloudflareHandler === "function")
        await cloudflareHandler(page);
    }
    body = await page.content();
    cookies = await page.cookies();
    if (typeof afterGotoHook === "function") afterGotoHook(page, browser);
  } catch (error) {
    console.error(error);
  }

  // close
  await page.close();
  if (toCloseBrowser) await browser.close();

  return { body, cookies, cookieStr: cookiesToStr(cookies) };
}

module.exports = { goto };
