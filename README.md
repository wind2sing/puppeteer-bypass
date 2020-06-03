# puppeteer-bypass

This library is used to bypass cloudflare's anti-bot pages using `puppeteer`.

## Installation

```bash
npm install puppeteer-bypass
```





## Usage

```javascript
const { goto } = require("puppeteer-bypass");
const url = "https://www.apotea.se/";
goto(url).then((results) => {
  console.log(results);
});

```

Results:

```bash
{
	body: '<html>...',
 	cookies: [
    ...
    {
      name: '__cfduid',
      value: 'd440de0b8ea4bc1c385d9d1b0aa5783a21591180642',
      ...
    },
    {
      name: 'cf_clearance',
      value: '3b0f56e475593fa3609fcbddfcfc01ae64b1a7cd-1591180642-0-150',
      ...
    }
  ],
  cookieStr: '...__cfduid=d440de0b8ea4bc1c385d9d1b0aa5783a21591180642; shopper=2e7e9b0a-272b-488f-a524-70879ecd681a; _fbp=fb.1.1591180646395.968143681; _gid=GA1.2.1784742894.1591180646; ASP.NET_SessionId=x5z0lslke3or0i2otjhzeoxf; _culture=sv; cf_clearance=3b0f56e475593fa3609fcbddfcfc01ae64b1a7cd-1591180642-0-150'
}
```



**Advanced Usage:**

```javascript
const { goto } = require("puppeteer-bypass");
const url = "https://www.apotea.se/";

goto(url, {

  //---- default options
  launchOptions: { devtools: true }, // options for puppeteer.lauch()
  gotoOptions: { timeout: 30000, waitUntil: "domcontentloaded" }, // options for page.goto()
  useBlockPlugin: true, // enabled by default
  configForBlockPlugin:{blockedTypes:new Set(["image"])},
  useStealthPlugin: true, // enabled by default
  cloudflareMark: "cf-browser-verification", 
  // call cloudflareHandler() if response's body contains this mark.

  
  //---- custom options
  cloudflareHandler: (page) => page.waitForSelector("#main-wrapper"), 
  // default handler is page.waitForNavigation()
  // change to your custom handler for quicker bypassing
  
  // hook function before calling page.goto(url)
  beforeGotoHook: (page, browser) => {
    page.setUserAgent('Elephant 1.0')
    page.on("response", (res) => {
      if (
        res.url().startsWith("https://www.apotea.se/?") &&
        res.status() === 200
      )
        console.log(res.request().headers()['user-agent']);
    });
  },
});
```

