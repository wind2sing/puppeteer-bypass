const vanillaPuppeteer = require("puppeteer");
const { addExtra } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const defaultBlockedTypes = new Set([
  // "document",
  "stylesheet",
  "image",
  "media",
  "font",
  // "script",
  "texttrack",
  // "xhr",
  // "fetch",
  "eventsource",
  "websocket",
  "manifest",
  "other",
]);
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
 *
 * @param {Object} options
 * @param {import('puppeteer').LaunchOptions} options.launchOptions
 * @param {import('puppeteer').DirectNavigationOptions} options.gotoOptions
 * @param {boolean} [options.useStealthPlugin]
 */
async function initBrowser({
  launchOptions = {},
  useStealthPlugin = true,
  // useBlockPlugin = true,
  // configForBlockPlugin = { blockedTypes: defaultBlockedTypes },
} = {}) {
  const puppeteer = addExtra(vanillaPuppeteer);
  const stealth = StealthPlugin();
  if (useStealthPlugin) puppeteer.use(stealth);

  Object.assign(launchOptions, defaultLaunchOptions);
  const browser = await puppeteer.launch(launchOptions);
  return browser;
}
module.exports = initBrowser;
