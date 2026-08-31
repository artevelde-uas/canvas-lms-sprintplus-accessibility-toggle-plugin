import { dom } from '@artevelde-uas/canvas-lms-app';
import pTimeout, { TimeoutError } from 'p-timeout';

import t from './i18n';
import ToggleSwitch from './components/ToggleSwitch';


const scriptUrl = 'https://sprintplus.online/websprinterembedded/latest/app.js';


function isWebsprinterScriptEmbedded() {
    // Check if the SprintPlus Websprinter script is already loaded by looking for the script tag in the document head
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    // Return true if the script is already present, false otherwise
    return (existingScript !== null);
}

function embedWebsprinterScript() {
    // Create a script tag for the SprintPlus Websprinter script
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

    // If the script is not loaded and initialization is requested, embed the SprintPlus Websprinter script
    if (initialize && !websprinterLoaded) {
        console.log('Initializing SprintPlus Websprinter script embedding...');

        embedWebsprinterScript();
    }

    // Wait up to three seconds for the Jabbla root element to be ready in the DOM
    pTimeout(
        dom.onElementReady('#jabbla-root'),
        abortAfter
    ).then(async (jabblaRootElement) => {
        const websprinterToggle = new ToggleSwitch({
            label: t('toggleLabel')
        });

        // Add the Websprinter toggle switch to the user's accessibility settings, right after the dyslexic font toggle switch
        // Listen for each addition of the dyslexic font toggle element
        dom.onElementAdded('[data-testid="dyslexic-font-toggle"]', async dyslexicFontToggle => {
            const websprinterToggleElement = websprinterToggle.render();

            // Add the Websprinter toggle right after the dyslexic font toggle
            dyslexicFontToggle.parentElement.insertBefore(websprinterToggleElement, dyslexicFontToggle.nextSibling);
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
