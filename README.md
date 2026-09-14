# Canvas LMS SprintPlus Accessibility Toggle Plug-in

Plug-in for the [Canvas LMS theme app](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-app) that adds a toggle switch to the user's accessibility settings in Canvas LMS for enabling/disabling the SprintPlus WebSprinter UI.

[![](https://img.shields.io/badge/GitHub%20Packages-available-181717?logo=github)](https://github.com/artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin/packages)
[![](https://img.shields.io/github/license/artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://spdx.org/licenses/ISC)

## Features

- Adds a toggle to the Canvas accessibility settings for showing or hiding SprintPlus WebSprinter.
- Remembers the selected visibility state in the browser's local storage.
- Can load the SprintPlus WebSprinter script when the plug-in initializes.
- Can show a first-run tutorial that highlights the SprintPlus WebSprinter toggle.

## Installation

The package is available from [GitHub Packages](https://github.com/artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin/packages).

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
  showTutorial: false,
});

run();
```

### Options

| Name                   | Type        | Default  | Description                                                                                                                                                |
| :--------------------- | :---------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **defaultVisible**     | `{Boolean}` | `false`  | Visibility to use the first time the plug-in runs, before WebSprinter's visibility preference exists in local storage. Existing preferences are preserved. |
| **initialize**         | `{Boolean}` | `true`   | Whether to add the SprintPlus WebSprinter script to the page when it has not already been loaded.                                                          |
| **websprinterVersion** | `{String}`  | `latest` | Version of the SprintPlus WebSprinter script to load. Use `test` to load the test script.                                                                  |
| **abortAfter**         | `{Number}`  | `3000`   | Maximum time, in milliseconds, to wait for the WebSprinter `#jabbla-root` element before logging a timeout error.                                          |
| **showTutorial**       | `{Boolean}` | `false`  | Whether to display a tutorial modal that highlights the toggle. It is shown only on the first run, before a visibility preference is stored.               |
