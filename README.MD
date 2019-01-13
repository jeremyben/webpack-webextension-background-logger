# Web Extension Background Logger

## What

**Log centralization** for you Web/Chrome Extension.
Compatible with every browser extension : **Chrome**, **Firefox**, **Safari**, **Edge**.

## Why

When you develop your Web Extension, you have to keep an eye on multiple consoles and logs from :

- Background script.
- Content script.
- Popup page (either _page action_ or _browser action_).
- Option page.

This webpack plugin allows you to centralize all logs in the background page console.

## Get Started

First, install Web Extension Background Logger :

```bash
# npm
npm i -D webpack-webextension-background-logger

# yarn
yarn add -D webpack-webextension-background-logger
```

Add to your Webpack config :

```js
const BackgroundLogger = require('webpack-webextension-background-logger')

module.exports = {
  // your webpack config
  // ...

  plugins: [new BackgroundLogger()],
}
```

Web Extension Background Logger will look for an entry named `background` by default, but you can customize this :

```js
new BackgroundLogger({ backgroundEntry: 'main' })
```

## Usage

Now, instead of using good old `console.log`, simply use `console.bg` :

```js
console.bg('loggy-log-log', foo)
```

This will print your log in the background page console.

#### Types for `console.bg`

If you use TypeScript, or type check your JavaScript (like this project does), you might want to tell the compiler that `console.bg` exists.

To do this, include in a declaration file (`typings.d.ts` for example) at the root of your project :

```ts
/// <reference types="webpack-webextension-background-logger/console" />
```

Or you can add to your `tsonfig.json` :

```json
{
  "compilerOptions": {
    "typeRoots": ["node_modules/@types", "node_modules/webpack-webextension-background-logger"]
  }
}
```

### Production build

For production builds, you can opt out of background logger and revert to plain `console.log` statements :

```js
new BackgroundLogger({ revertToLog: true })
```

This will simply remove Background Logger from your build and rewrite every `console.bg` statement into `console.log` statement.