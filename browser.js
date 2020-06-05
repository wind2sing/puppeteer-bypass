const vanillaPuppeteer = require("puppeteer");
const { addExtra } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const defaultLaunchOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
};
/**
 *
 * @typedef {Object} ConfigBlock
 * @property {Set<string>} blockedTypes
 */
/**
 *
 * @typedef {Object} ConfigUA
 * @property {boolean} stripHeadless
 * @property {boolean} makeWindows
 * @property {function} customFn
 */

/**
 * @callback HookP
 * @param {import('puppeteer-extra').PuppeteerExtra} puppeteer
 */

/**
 *
 * @param {Object} options
 * @param {import('puppeteer').LaunchOptions} options.launchOptions
 * @param {import('puppeteer').DirectNavigationOptions} options.gotoOptions
 * @param {boolean} [options.useStealthPlugin]
 * @param {HookP} [options.beforeLaunchHook]
 */
async function initBrowser({
  launchOptions = {},
  useStealthPlugin = true,
  beforeLaunchHook = null,
} = {}) {
  const puppeteer = addExtra(vanillaPuppeteer);
  const stealth = StealthPlugin();
  if (useStealthPlugin) puppeteer.use(stealth);

  Object.assign(launchOptions, defaultLaunchOptions);
  if (typeof beforeLaunchHook === "function") beforeLaunchHook(puppeteer);
  const browser = await puppeteer.launch(launchOptions);
  return browser;
}
module.exports = initBrowser;
