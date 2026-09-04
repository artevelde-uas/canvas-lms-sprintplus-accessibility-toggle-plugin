# Canvas LMS SprintPlus Accessibility Toggle Plug-in

Plug-in for the [Canvas LMS theme app](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-app) that adds a toggle switch to the user's accessibility settings in Canvas LMS for enabling/disabling the Sprint+ Websprinter UI.

[![](https://img.shields.io/npm/v/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin)
[![](https://img.shields.io/github/license/artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://spdx.org/licenses/ISC)
[![](https://img.shields.io/npm/dt/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin)

## Features

- Adds a toggle to the Canvas accessibility settings for showing or hiding Sprint+ Websprinter.
- Remembers the selected visibility state in the browser's local storage.
- Can load the Sprint+ Websprinter script when the plug-in initializes.

## Installation

Using NPM:

    npm install @artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin

Using Yarn:

    yarn add @artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin

## Usage

Just import the plug-in and add it to the Canvas app:

```javascript
import { run, addPlugin } from '@artevelde-uas/canvas-lms-app';
import sprintplusAccessibilityTogglePlugin from '@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin';

addPlugin(sprintplusAccessibilityTogglePlugin, {
  defaultVisible: false,
  initialize: true,
  websprinterVersion: 'latest',
  abortAfter: 3000,
});

run();
```

### Options

| Name                   | Type        | Default  | Description                                                                                                                                                |
| :--------------------- | :---------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **defaultVisible**     | `{Boolean}` | `false`  | Visibility to use the first time the plug-in runs, before Websprinter's visibility preference exists in local storage. Existing preferences are preserved. |
| **initialize**         | `{Boolean}` | `true`   | Whether to add the Sprint+ Websprinter script to the page when it has not already been loaded.                                                             |
| **websprinterVersion** | `{String}`  | `latest` | Version of the Sprint+ Websprinter script to load. Use `test` to load the test script.                                                                     |
| **abortAfter**         | `{Number}`  | `3000`   | Maximum time, in milliseconds, to wait for the Websprinter `#jabbla-root` element before logging a timeout error.                                          |
