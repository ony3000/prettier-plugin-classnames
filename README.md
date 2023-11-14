# prettier-plugin-classnames

A Prettier plugin that wraps verbose class name based on the `printWidth` option.

![A use case for this plugin.](.github/banner.png)

## Installation

For Prettier v2:

```sh
npm install -D prettier@^2 prettier-plugin-classnames
```

For Prettier v3:

```sh
npm install -D prettier prettier-plugin-classnames @prettier/sync
```

## Configuration

JSON:

```json
{
  "plugins": ["prettier-plugin-classnames"],
  "customAttributes": ["className"],
  "customFunctions": ["classNames"]
}
```

JS (CommonJS module):

```javascript
module.exports = {
  plugins: ['prettier-plugin-classnames'],
  customAttributes: ['className'],
  customFunctions: ['classNames'],
};
```

JS (ES module):

```javascript
export default {
  plugins: ['prettier-plugin-classnames'],
  customAttributes: ['className'],
  customFunctions: ['classNames'],
};
```

## Options

Although the purpose of this plugin is to wrap verbose class name into readable lengths, you can also wrap non class name strings into readable lengths by setting any of the following two options:

<!-- prettier-ignore -->
Option | Default&nbsp;value | Description
--- | --- | ---
`customAttributes` | `[]` | List of attributes that enclosing class names.<br>The `className` attribute is always supported, even if no options are specified.
`customFunctions` | `[]` | List of functions that enclosing class names.<br>The `classNames` function is always supported, even if no options are specified.

## Compatibility with other Prettier plugins

If more than one Prettier plugin can handle the text you want to format, Prettier will only use the last of those plugins.

In this case, you can configure it as follows by adding [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge) to apply those plugins sequentially.

JSON example:

```json
{
  "plugins": [
    "another-prettier-plugin",
    "prettier-plugin-classnames",
    "prettier-plugin-merge"
  ]
}
```
