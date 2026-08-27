import { dom } from '@artevelde-uas/canvas-lms-app';

import t from './i18n';


const scriptUrl = 'https://sprintplus.online/websprinterembedded/latest/app.js';


function isWebsprinterScriptEmbedded() {
    // Check if the SprintPlus WebSprinter script is already loaded by looking for the script tag in the document head
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    // Return true if the script is already present, false otherwise
    return (existingScript !== null);
}

function embedSprintPlusScript() {
    // Create a script tag for the SprintPlus WebSprinter script
    const script = document.createElement('script');
    script.type = 'module';
    script.crossOrigin = '';
    script.src = scriptUrl;

    // Add the script to the document head
    document.head.appendChild(script);
}


export default async function ({
    defaultVisible = false,
    initialize = true,
}) {
    const websprinterLoaded = isWebsprinterScriptEmbedded();

    // If the script is not loaded and initialization is requested, embed the SprintPlus WebSprinter script
    if (initialize && !websprinterLoaded) {
        console.log('Initializing SprintPlus WebSprinter script embedding...');

        embedSprintPlusScript();
    }

    // Return package metadata along with localized title and description
    return {
        ...require('../package.json'),
        title: t('package.title'),
        description: t('package.description')
    };
}
