const puppeteer = require("puppeteer-extra").default;
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const BlockPlugin = require("puppeteer-extra-plugin-block-resources");
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
 * @param {boolean} [options.useBlockPlugin]
 * @param {boolean} [options.useStealthPlugin]
 * @param {ConfigBlock} [options.configForBlockPlugin]
 * @param {ConfigUA} [options.configForUAPlugin]
 */
async function initBrowser({
  launchOptions = {},
  useStealthPlugin = true,
  useBlockPlugin = true,
  configForBlockPlugin = { blockedTypes: defaultBlockedTypes },
} = {}) {
  if (useStealthPlugin) puppeteer.use(StealthPlugin());
  if (useBlockPlugin) puppeteer.use(BlockPlugin(configForBlockPlugin));

  Object.assign(launchOptions, defaultLaunchOptions);
  const browser = await puppeteer.launch(launchOptions);
  return browser;
}
module.exports = initBrowser;
