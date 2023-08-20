# prettier-plugin-classnames

A Prettier plugin that wraps verbose class name based on the `printWidth` option.

**Note**: Prettier v3 is not yet supported.

![A use case for this plugin.](.github/banner.png)

## Installation

```sh
npm install -D prettier@~2.8 prettier-plugin-classnames
```

```sh
yarn add -D prettier@~2.8 prettier-plugin-classnames
```

```sh
pnpm add -D prettier@~2.8 prettier-plugin-classnames
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

JS:

```javascript
module.exports = {
  plugins: [require('prettier-plugin-classnames')],
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

## Limitation

Because this plugin supports babel parser and typescript parser, only one plugin can be applied for overlapping parsers when used with other plugins that support either or both parsers.

In this case, if the printer corresponding to the overlapping parser is not implemented in another plugin, you can add [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge) to configure it as follows.

JSON example:

```json
{
  "plugins": [
    "another-prettier-plugin-that-implements-babel-or-typescript-parser",
    "prettier-plugin-classnames",
    "prettier-plugin-merge"
  ],
  "customFunctions": ["clsx"]
}
```
