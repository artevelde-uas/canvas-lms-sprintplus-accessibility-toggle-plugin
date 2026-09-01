# Canvas LMS SprintPlus Accessibility Toggle Plug-in

Plug-in for the [Canvas LMS theme app](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-app) that adds a toggle switch to the user's accessibility settings in Canvas LMS for enabling/disabling the Sprint+ Websprinter UI.

[![](https://img.shields.io/npm/v/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin)
[![](https://img.shields.io/github/license/artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://spdx.org/licenses/ISC)
[![](https://img.shields.io/npm/dt/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin.svg)](https://www.npmjs.com/package/@artevelde-uas/canvas-lms-sprintplus-accessibility-toggle-plugin)

## Features

The following configurable options are available:

-

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
});

run();
```

### Options

|    Name     |    Type     | Default | Description     |
| :---------: | :---------: | :-----: | :-------------- |
| **example** | `{Boolean}` | `false` | Example option. |
