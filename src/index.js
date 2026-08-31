import { dom } from '@artevelde-uas/canvas-lms-app';
import pTimeout, { TimeoutError } from 'p-timeout';

import t from './i18n';
import ToggleSwitch from './components/ToggleSwitch';


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
    abortAfter = 3000,
}) {
    const websprinterLoaded = isWebsprinterScriptEmbedded();

    // If the script is not loaded and initialization is requested, embed the SprintPlus WebSprinter script
    if (initialize && !websprinterLoaded) {
        console.log('Initializing SprintPlus WebSprinter script embedding...');

        embedSprintPlusScript();
    }

    // Wait up to three seconds for the Jabbla root element to be ready in the DOM
    pTimeout(
        dom.onElementReady('#jabbla-root'),
        abortAfter
    ).then(async (jabblaRootElement) => {
        const sprintPlusToggle = new ToggleSwitch({
            label: t('toggleLabel')
        });

        // Add the SprintPlus toggle switch to the user's accessibility settings
        // Listen for each addition of the dyslexic font toggle element
        dom.onElementAdded('[data-testid="dyslexic-font-toggle"]', async dyslexicFontToggle => {
            const sprintPlusToggleElement = sprintPlusToggle.render();

            // Add the SprintPlus toggle right after the dyslexic font toggle
            dyslexicFontToggle.parentElement.insertBefore(sprintPlusToggleElement, dyslexicFontToggle.nextSibling);
        });

    }).catch(error => {
        if (error instanceof pTimeout) {
            console.error(`Error waiting for Jabbla root element: ${error.message}`);
        } else {
            console.error(error);
        }
    });

    // Return package metadata along with localized title and description
    return {
        ...require('../package.json'),
        title: t('package.title'),
        description: t('package.description')
    };
}
