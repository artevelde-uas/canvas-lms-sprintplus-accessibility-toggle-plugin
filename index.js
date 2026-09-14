import { addPlugin, run } from '@artevelde-uas/canvas-lms-app';

import plugin from './src';

console.clear();

addPlugin(plugin, {
    websprinterVersion: 'test',
    defaultVisible: true,
    showTutorial: true,
});

run();
